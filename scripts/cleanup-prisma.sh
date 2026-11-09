#!/bin/bash
# Cleanup Prisma files - Per user decision to not use Prisma

echo "🗑️  Cleaning up Prisma files..."

# Remove prisma directory if it exists
if [ -d "prisma" ]; then
    echo "Removing prisma directory..."
    rm -rf prisma
fi

# Remove Prisma-related scripts from src directory
if [ -d "src" ] && [ -f "src/scripts/setup-prisma.sh" ]; then
    echo "Removing setup-prisma.sh from src/"
    rm "src/scripts/setup-prisma.sh"
fi

# Uninstall Prisma dev dependencies (dry-run mode shown)
echo ""
echo "To uninstall Prisma from package.json, run:"
echo "  npm uninstall -D @prisma/cli prisma"
echo ""
echo "Done! Files cleaned up."
