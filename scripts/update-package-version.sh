#!/bin/bash
# Update package.json to v0.1.1

echo "Updating package.json..."

sed -i 's/"version": "0.1.0-beta"/"version": "0.1.1"/g' package.json
sed -i 's/"version:0.1.0": "npm version 0.1.0/\"version:0.1.1\": \"npm version 0.1.1/g' package.json

# Update repository URL
sed -i 's|https://github.com/your-username/ultron-orchestrator.git|https://github.com/SmelliW/ultron-orchestrator.git|g' package.json

# Update description for v0.1.1
sed -i '/\"description\": /a\  "type": "patch"' package.json

echo "package.json updated to v0.1.1"
cat package.json | head -20
