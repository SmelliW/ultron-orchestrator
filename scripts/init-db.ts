// Initialize Prisma Database Schema
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function init() {
  console.log('🔧 Inicializando base de datos de Ultron...');

  try {
    // Sync schema (crear tablas si no existen)
    await prisma.$connect();
    console.log('✅ Base de datos conectada (SQLite local: memory.db)');

    // Verificar usuarios existentes
    const users = await prisma.user.findMany();
    if (users.length > 0) {
      console.log(`ℹ️  ${users.length} usuario(s) ya exist(es) en la base de datos`);
    } else {
      console.log('ℹ️  No hay usuarios - se crearán al registrar');
    }

    const tokens = await prisma.token.findMany();
    console.log(`ℹ️  ${tokens.length} token(s) activo/s actualmente`);

    console.log('\n🎉 Inicialización completada exitosamente!');
    console.log('   - DB: SQLite (local: memory.db)');
    console.log('   - Tablas: users, tokens');
    console.log('   - Estado: Listo para registrar usuarios');

    // Esperar 5 segundos antes de cerrar
    await new Promise(resolve => setTimeout(resolve, 5000));

  } catch (error) {
    console.error('❌ Error al inicializar base de datos:', error);
  } finally {
    // Asegurar cierre (opcional para desarrollo)
    // await prisma.$disconnect();
    await prisma.$disconnect?.();
  }
}

// Ejecutar cuando se importa como script
init();
