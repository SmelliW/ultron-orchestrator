# 📋 TODO v0.2.0 - Tareas Pendientes

## 🔴 CRÍTICO (Prioridad Alta)

### 1. Completar API con Prisma DB real
**Estado:** ❌ Mock → ⚠️ Pending  
**Archivo:** `src/api/routes/users.routes.ts`  
**Desafío actual:** Routes definen endpoints pero no tienen conexión real a DB

```typescript
// ACTUAL (mock)
app.post('/api/users/register', async (req, res) => {
  // Simulado - no hay backend real
  const mockUser = { id: 1, name: 'Juan' };
  return res.json(mockUser);
});

// NECESARIO
app.post('/api/users/register', async (req, res) => {
  const prisma = require('@prisma/client').Prisma;
  const user = await prisma.user.create({ /* ... */ });
  return res.json(user);
});
```

---

### 2. Reemplazar llamadas simuladas por Claude API reales
**Estado:** ❌ Simulado → ⚠️ Pending  
**Archivo:** `src/planner/planner.ts`  
**Desafío actual:** Skills llamadas pero no conectadas a API real de Claude

```typescript
// ACTUAL (simulado)
const generateSkillPlan = async () => {
  return ['phase1', 'phase2']; // Mock
};

// NECESARIO
const generateSkillPlan = async () => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    headers: { /* ... */ },
    body: JSON.stringify({ messages: [...], max_tokens: 2048 })
  });
  return response.json();
};
```

---

## 🟡 ALTA (Prioridad Media)

### 3. Executor Engine real con Git Worktrees
**Estado:** ⚠️ Parcial  
**Archivo:** `src/executor/executor.ts`  

**Lo que funciona:** Estructura del framework, lógicos simulados  
**Lo necesario:** Ejecución real de comandos en worktrees aislados

```typescript
// NECESARIO
const executePhase = async (phase) => {
  const tempDir = await exec('git', ['worktree', 'add', '-m', 'phase-' + phase.name]);
  // ... ejecución real de comandos npm, build, test, etc.
};
```

---

### 4. Sistema de verificación entre fases
**Estado:** ⚠️ Pendiente  
**Descripción:** Validación automática post-fase antes de avanzar

```typescript
// NECESARIO
const verifyPhase = async (phase) => {
  await exec('git', ['diff', '--exit-code']);
  if (exitCode !== 0) {
    // Rollback automático
    await exec('git', ['checkout', '+HEAD~1']);
    throw new Error(`Phase ${phase.name} failed`);
  }
};
```

---

## 🔵 MEDIA (v1.0.0 - Future)

### 5. CI/CD Pipeline
- GitHub Actions para tests unitarios y deployment

### 6. Tests Unitarios (Jest >70%)
- Coverage reporting

---

## 📊 Estado Actual del Proyecto (v0.1.0-beta)

| Componente | % Completado |
|------------|-------------|
| Git Repository | ✅ 100% |
| API Server Express | ⚠️ 50% |
| User Routes | ❌ Mocked |
| Planner Engine | ❌ Simulated |
| Memory Manager | ✅ 60% (SQLite) |
| Executor Engine | ❌ Not implemented |

---

*Última actualización: 2026-11-08*  
*Repo: https://github.com/SmelliW/ultron-orchestrator.git*
