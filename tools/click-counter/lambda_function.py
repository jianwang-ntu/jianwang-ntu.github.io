"""Lambda backend for the blog's global click counter.

POST /  body={"slug": "..."}   → atomic increment, returns {"slug","count"}
GET  /                          → returns {slug: count, ...} for every slug

Uses DynamoDB on-demand (PAY_PER_REQUEST). Atomic ADD avoids races without
needing optimistic locking. Rate-limit / dedup is handled client-side
(Blog.jsx posts at most once per session per slug); abuse mitigation here
is just sane CORS + a slug shape check.
"""
from __future__ import annotations
import json
import os
import re
import logging

import boto3

log = logging.getLogger()
log.setLevel(logging.INFO)

TABLE_NAME = os.environ["TABLE_NAME"]

# Wildcard subdomains aren't expressible in the static
# Access-Control-Allow-Origin header — browsers want an *exact* match. So we
# keep a list of regexes server-side, decide per-request whether the Origin
# qualifies, and echo it back verbatim. Anything not listed gets no CORS
# headers and the browser blocks the response.
_ORIGIN_PATTERNS = [
    re.compile(r"^https://jianwang-ntu\.github\.io$"),
    re.compile(r"^https://([a-z0-9-]+\.)*wj2ai\.com$"),
    re.compile(r"^https://([a-z0-9-]+\.)*ai2wj\.com$"),
]
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,99}$")

_table = boto3.resource("dynamodb").Table(TABLE_NAME)


def _cors_headers(origin: str) -> dict[str, str]:
    # Echo back the request origin only when it matches one of the allowed
    # patterns. If it doesn't, omit the CORS headers entirely so the browser
    # surfaces a clear "blocked by CORS" rather than a confusing partial OK.
    if origin and any(p.match(origin) for p in _ORIGIN_PATTERNS):
        return {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "content-type",
            "Access-Control-Max-Age": "600",
            "Vary": "Origin",
            "Content-Type": "application/json",
        }
    # Non-CORS request (e.g. server-to-server) or disallowed origin.
    return {"Content-Type": "application/json"}


def _resp(status: int, body: dict | list | str, headers: dict[str, str]) -> dict:
    return {"statusCode": status, "headers": headers, "body": json.dumps(body)}


def lambda_handler(event, _context):
    method = event.get("requestContext", {}).get("http", {}).get("method", "GET")
    headers_in = {k.lower(): v for k, v in (event.get("headers") or {}).items()}
    origin = headers_in.get("origin", "")
    headers = _cors_headers(origin)

    if method == "OPTIONS":
        return {"statusCode": 204, "headers": headers, "body": ""}

    try:
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            slug = (body.get("slug") or "").strip().lower()
            if not SLUG_RE.match(slug):
                return _resp(400, {"error": "invalid slug"}, headers)
            res = _table.update_item(
                Key={"slug": slug},
                UpdateExpression="ADD #c :one",
                ExpressionAttributeNames={"#c": "count"},
                ExpressionAttributeValues={":one": 1},
                ReturnValues="UPDATED_NEW",
            )
            new_count = int(res["Attributes"]["count"])
            return _resp(200, {"slug": slug, "count": new_count}, headers)

        if method == "GET":
            counts: dict[str, int] = {}
            scan_kwargs = {"ProjectionExpression": "slug, #c",
                           "ExpressionAttributeNames": {"#c": "count"}}
            while True:
                page = _table.scan(**scan_kwargs)
                for item in page.get("Items", []):
                    counts[item["slug"]] = int(item.get("count", 0))
                if "LastEvaluatedKey" not in page:
                    break
                scan_kwargs["ExclusiveStartKey"] = page["LastEvaluatedKey"]
            return _resp(200, counts, headers)

        return _resp(405, {"error": "method not allowed"}, headers)
    except Exception as e:
        log.exception("handler failed")
        return _resp(500, {"error": "internal error", "detail": str(e)[:200]}, headers)
