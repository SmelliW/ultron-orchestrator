#!/bin/bash
# Setup Prisma for Ultron API Backend
echo "📦 Installing Prisma CLI..."
npm install -D @prisma/cli prisma

echo "✅ Prisma CLI installed"

# Initialize Prisma if not already initialized
if [ ! -f "prisma/schema.prisma" ]; then
    echo "📝 Creating Prisma schema..."
    cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url = "file:./dev.db"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
}
EOF
    echo "✅ Prisma schema created"
fi

echo "🔧 Prisma setup complete!"
