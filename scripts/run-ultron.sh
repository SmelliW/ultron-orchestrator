#!/bin/bash
# Ultron/Jarvis CLI - AI Orchestrator Agent

echo "🤖 Starting Ultron/Jarvis Agent"
echo "=============================================================="

# Load environment
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp .env.example .env
fi

export $(cat .env | grep -v '^#' | xargs)

cd "$(dirname "$0")/.."

# Run the orchestrator with TypeScript
npx ts-node src/index.ts
