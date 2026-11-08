#!/bin/bash
# ULTRON Release Script - Versioning automation

set -e  # Exit on error

echo "=========================================="
echo "🚀 ULTRON Release Automation"
echo "=========================================="

VERSION=$1

if [ -z "$VERSION" ]; then
    echo "Usage: $0 <version>"
    echo "Example: $0 1.0.0"
    exit 1
fi

cd "$(dirname "$0")/.."

echo "Creating version $VERSION..."

# Update package.json version
npm version $VERSION --no-git-tag-version

# Get current date
DATE=$(date +%Y-%m-%d)
USER_NAME=$(git config user.name)
EMAIL=$(git config user.email)

# Commit with proper message
COMMIT_MSG="v$VERSION: Release ULTRON $VERSION"
echo "Committing: $COMMIT_MSG"

# If beta version, include note
if [[ "$VERSION" == *"beta"* ]]; then
    COMMIT_MSG="$COMMIT_MSG - Beta release (feature development)"
fi

git commit -m "$COMMIT_MSG" > /dev/null 2>&1 || {
    echo "❌ Commit failed. Please check your configuration."
    exit 1
}

echo "✅ Version $VERSION released successfully!"
echo ""
echo "Next steps:"
echo "1. Review the commit message above"
echo "2. Push to GitHub: git push origin main"
echo "3. Create release on GitHub: gh release create v$VERSION..."
