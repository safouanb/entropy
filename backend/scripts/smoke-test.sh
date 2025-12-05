#!/usr/bin/env bash
# Smoke tests for PyRecycle Heat Go backend (ConnectRPC)
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:8080}"

echo "==> Smoke Testing PyRecycle Heat Backend"
echo "    Base URL: $BASE_URL"
echo ""

# Health check
echo "[1/5] Health check..."
curl -sf "$BASE_URL/health" | jq -e '.status == "healthy"' > /dev/null
echo "✓ Health check passed"

# gRPC Health (requires grpcurl)
if command -v grpcurl &> /dev/null; then
    echo "[2/5] gRPC health check..."
    grpcurl -plaintext -d '{"service":""}' localhost:8080 grpc.health.v1.Health/Check | jq -e '.status == "SERVING"' > /dev/null
    echo "✓ gRPC health check passed"
else
    echo "[2/5] gRPC health check... SKIPPED (grpcurl not installed)"
fi

# ConnectRPC JSON: ListHeatCenters
echo "[3/5] ConnectRPC JSON: ListHeatCenters..."
curl -sf -H 'Content-Type: application/json' \
    -d '{"pagination":{"page":1,"page_size":10}}' \
    "$BASE_URL/pyrecycleheat.v1.DistrictHeatingService/ListHeatCenters" | jq -e '.pagination.totalCount >= 0' > /dev/null
echo "✓ ListHeatCenters passed"

# ConnectRPC JSON: ListDataCenters
echo "[4/5] ConnectRPC JSON: ListDataCenters..."
curl -sf -H 'Content-Type: application/json' \
    -d '{"pagination":{"page":1,"page_size":10}}' \
    "$BASE_URL/pyrecycleheat.v1.PredictionService/ListDataCenters" | jq -e '.pagination.totalCount >= 0' > /dev/null
echo "✓ ListDataCenters passed"

# Metrics endpoint
echo "[5/5] Metrics endpoint..."
curl -sf "$BASE_URL/metrics" | grep -q 'pyrecycleheat_info'
echo "✓ Metrics endpoint passed"

echo ""
echo "==> All smoke tests passed! ✓"

