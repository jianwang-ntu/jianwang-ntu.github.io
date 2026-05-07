#!/usr/bin/env bash
# Re-zip and update the click-counter Lambda. Run from this directory.
#
# One-time provisioning (already done — recorded here for reference) was:
#
#   aws dynamodb create-table --table-name github-io-blog-clicks \
#     --attribute-definitions AttributeName=slug,AttributeType=S \
#     --key-schema AttributeName=slug,KeyType=HASH \
#     --billing-mode PAY_PER_REQUEST --region ap-southeast-1
#
#   aws iam create-role --role-name github-io-blog-clicks \
#     --assume-role-policy-document file://iam-trust-policy.json
#   aws iam attach-role-policy --role-name github-io-blog-clicks \
#     --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
#   aws iam put-role-policy --role-name github-io-blog-clicks \
#     --policy-name DDBCounter --policy-document file://iam-policy.json
#
#   zip lambda.zip lambda_function.py
#   aws lambda create-function --function-name github-io-blog-clicks \
#     --runtime python3.12 --architectures arm64 \
#     --role arn:aws:iam::332149362719:role/github-io-blog-clicks \
#     --handler lambda_function.lambda_handler \
#     --zip-file fileb://lambda.zip --timeout 8 --memory-size 256 \
#     --environment Variables='{TABLE_NAME=github-io-blog-clicks,ALLOWED_ORIGINS=https://jianwang-ntu.github.io}' \
#     --region ap-southeast-1
#
#   aws apigatewayv2 create-api --name github-io-blog-clicks \
#     --protocol-type HTTP \
#     --target arn:aws:lambda:ap-southeast-1:332149362719:function:github-io-blog-clicks \
#     --cors-configuration 'AllowOrigins=https://jianwang-ntu.github.io,https://wj2ai.com,https://www.wj2ai.com,https://blog.wj2ai.com,https://app.wj2ai.com,https://ai2wj.com,https://www.ai2wj.com,https://blog.ai2wj.com,https://app.ai2wj.com,AllowMethods=GET,POST,OPTIONS,AllowHeaders=content-type,MaxAge=600' \
#     --region ap-southeast-1
#
# To add more origins later:
#   aws apigatewayv2 update-api --api-id <id> \
#     --cors-configuration 'AllowOrigins=<comma-separated>,AllowMethods=GET,POST,OPTIONS,AllowHeaders=content-type,MaxAge=600' \
#     --region ap-southeast-1
#   aws lambda add-permission --function-name github-io-blog-clicks \
#     --statement-id APIGW --action lambda:InvokeFunction \
#     --principal apigateway.amazonaws.com \
#     --source-arn 'arn:aws:execute-api:ap-southeast-1:332149362719:<api-id>/*/*' \
#     --region ap-southeast-1
#
# After that, the only ongoing operation is updating the function code,
# which this script does.

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

REGION="${REGION:-ap-southeast-1}"
FN="${FN:-github-io-blog-clicks}"

rm -f lambda.zip
zip -q lambda.zip lambda_function.py
aws lambda update-function-code \
  --function-name "$FN" \
  --zip-file fileb://lambda.zip \
  --region "$REGION" \
  --no-cli-pager \
  --query '{State:State,LastModified:LastModified,Size:CodeSize}'

echo
echo "Smoke test:"
URL=$(aws apigatewayv2 get-apis --region "$REGION" \
  --query "Items[?Name=='${FN}'].ApiEndpoint | [0]" --output text)
curl -sS -H 'Origin: https://jianwang-ntu.github.io' "$URL/" && echo
