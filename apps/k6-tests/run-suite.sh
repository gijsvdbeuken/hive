#!/bin/bash

API_URL=${1:-"https://api.hive-app.nl"}

echo "🚀 Running load test suite against: $API_URL"
echo "=================================="

echo "📊 Testing Health Check..."
k6 run tests/health-check.js --env API_BASE_URL=$API_URL

echo "📊 Testing User Service (GET)..."
k6 run tests/user-service.js --env API_BASE_URL=$API_URL

echo "📊 Testing User Updates (PUT)..."  
k6 run tests/user-update.js --env API_BASE_URL=$API_URL

echo "📊 Testing User Delete (DELETE)..."
k6 run tests/user-delete.js --env API_BASE_URL=$API_URL

echo "📊 Testing LLM Hives (GET)..."
k6 run tests/llm-hives-get.js --env API_BASE_URL=$API_URL

echo "📊 Testing LLM Hives Creation (POST)..."
k6 run tests/llm-hives-create.js --env API_BASE_URL=$API_URL

echo "📊 Testing LLM Hives Workflow (Full CRUD)..."
k6 run tests/llm-hives-workflow.js --env API_BASE_URL=$API_URL

echo "📊 Testing LLM Response Service..."
k6 run tests/llm-responses-test.js --env API_BASE_URL=$API_URL

echo "📊 Testing AI Integration (Light verification)..."
k6 run tests/llm-responses-ai-verify.js --env API_BASE_URL=$API_URL

echo "✅ Complete load test suite finished!"
