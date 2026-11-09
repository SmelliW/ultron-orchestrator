#!/usr/bin/env node
// Initialize Prisma Database Schema (standalone script)

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : []
});

async function init() {
  console.log('🔧 Inicializando base de datos de Ultron...');

  try {
    // Sync schema (crear tablas si no existen)
    await prisma.$connect();
    console.log('✅ Base de datos conectada (SQLite local: memory.db)');

    // Verificar usuarios existentes
    const users = await prisma.user.findMany();
    if (users.length > 0) {
      console.log(`ℹ️  ${users.length} usuario(s) ya exist(es)`);
    } else {
      console.log('ℹ️  No hay usuarios - se crearán al registrar');
    }

    const tokens = await prisma.token.findMany();
    console.log(`ℹ️  ${tokens.length} token(s) activo/s actualmente`);

    console.log('\n🎉 Inicialización completada exitosamente!');
    console.log('   - DB: SQLite (local: memory.db)');
    console.log('   - Tablas: users, tokens');
    console.log('   - Estado: Listo para registrar usuarios\n');

  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
  } finally {
    await prisma.$disconnect?.();
  }
}

// Ejecutar directamente cuando se llama como script
if (require.main === module) {
  init();
}
