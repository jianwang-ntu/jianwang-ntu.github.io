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
ALLOWED_ORIGINS = {
    o.strip()
    for o in os.environ.get("ALLOWED_ORIGINS", "https://jianwang-ntu.github.io").split(",")
    if o.strip()
}
SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{0,99}$")

_table = boto3.resource("dynamodb").Table(TABLE_NAME)


def _cors_headers(origin: str) -> dict[str, str]:
    # Echo back the request origin only when it's on the allow-list — a
    # mismatched/missing origin still gets a default so the browser can
    # surface a CORS error rather than a server one.
    chosen = origin if origin in ALLOWED_ORIGINS else next(iter(ALLOWED_ORIGINS))
    return {
        "Access-Control-Allow-Origin": chosen,
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Max-Age": "600",
        "Vary": "Origin",
        "Content-Type": "application/json",
    }


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
