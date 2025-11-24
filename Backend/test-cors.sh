#!/bin/bash

# Simple CORS test script for the Feelize backend
# This script tests if CORS is properly configured

echo "🧪 Testing CORS Configuration..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Wait for server to be ready
echo "⏳ Waiting for server to start..."
sleep 2

# Test 1: Valid origin (localhost:5174)
echo "Test 1: Valid origin (http://localhost:5174)"
response=$(curl -s -o /dev/null -w "%{http_code}" -H "Origin: http://localhost:5174" http://localhost:3000/)
if [ "$response" = "200" ]; then
    echo -e "${GREEN}✅ PASS: Server accepts requests from http://localhost:5174${NC}"
else
    echo -e "${RED}❌ FAIL: Server rejected request (HTTP $response)${NC}"
fi
echo ""

# Test 2: Check CORS headers
echo "Test 2: CORS Headers Check"
cors_header=$(curl -s -I -H "Origin: http://localhost:5174" http://localhost:3000/ | grep -i "Access-Control-Allow-Origin")
if [[ $cors_header == *"http://localhost:5174"* ]]; then
    echo -e "${GREEN}✅ PASS: CORS header present: $cors_header${NC}"
else
    echo -e "${RED}❌ FAIL: CORS header missing or incorrect${NC}"
fi
echo ""

# Test 3: Invalid origin
echo "Test 3: Invalid origin (http://localhost:9999)"
response=$(curl -s -o /dev/null -w "%{http_code}" -H "Origin: http://localhost:9999" http://localhost:3000/)
if [ "$response" = "500" ]; then
    echo -e "${GREEN}✅ PASS: Server correctly rejects unauthorized origin${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: Server responded with HTTP $response (expected 500)${NC}"
fi
echo ""

# Test 4: Preflight request
echo "Test 4: Preflight OPTIONS request"
response=$(curl -s -o /dev/null -w "%{http_code}" -X OPTIONS \
    -H "Origin: http://localhost:5174" \
    -H "Access-Control-Request-Method: GET" \
    http://localhost:3000/api/users/verify)
if [ "$response" = "204" ]; then
    echo -e "${GREEN}✅ PASS: Preflight request successful${NC}"
else
    echo -e "${RED}❌ FAIL: Preflight failed (HTTP $response)${NC}"
fi
echo ""

echo "🎉 CORS testing complete!"
