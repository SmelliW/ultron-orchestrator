# Ultron/Jarvis - Usage Examples

## 🎯 Concepto Principal

**Ultron/Jarvis** es un agente orquestador que:
1. **Usa "make-plan"** para generar planes progresivos de implementación
2. **Usa "do" skill** para ejecutar los planes fase por fase  
3. **Usa "mem-search"** para buscar contexto en la memoria persistente
4. **Gestiona permisos automáticamente** con `PERMISSION_MODE=auto`

---

## Ejemplo 1: Proyecto Web API

```
Prompt a Ultron/Jarvis:

"Crear una API REST para gestión de usuarios con autenticación JWT y pagination usando Express"

El proceso seguirá estos pasos:

1. **Analizar requerimientos**: Entender alcance, dependencias
2. **Diseño & Arquitectura**: Diagramas de flujo de datos
3. **Setup de proyecto**: Estructura inicial de repositorio
4. **Desarrollo del core**: Implementación iterativa de funcionalidad
5. **Integración & Testing**: Ejecutar tests y verificar integration
6. **Documentación**: Crear README y docs para mantenimiento

Cada fase se verifica antes de proceder, usando skills como:
- verification-before-completion (verifica antes de completar)
- systematic-debugging (si hay errores)
- using-git-worktrees (aislamiento de cambios)
```

---

## Ejemplo 2: Debugging Sistemático

```
Prompt a Ultron/Jarvis:

"La API no devuelve paginación correcta, debugging..."

El proceso seguirá estos pasos:

1. **mem-search**: Buscar observaciones previas de errores similares
2. **Diagnóstico**: Usar systematic-debugging skill para trazar dependencias
3. **Historial de bugs**: Verificar patrones de fallas anteriores
4. **Solución**: Generar plan de corrección con verificación
5. **Knowledge Agent**: Actualizar base de conocimiento

Este ejemplo usa directamente el proyecto #3 "Debug Detective Dashboard"
```

---

## Ejemplo 3: Proyecto Data Pipeline

```
Prompt a Ultron/Jarvis:

"Estructurar un pipeline ETL que lea datos desde PostgreSQL, transforme con Pandas y escriba en S3"

Skills aplicadas:
- **make-plan**: Planificación compleja de data pipeline
- **executing-plans**: Ejecución paralela de fases
- **cloud-sync**: Sincronización con servicios externos
- **knowledge-agent**: Crear base de conocimiento sobre datos transformados

Estructura sugerida de planes:
Phase 1: Setup infrastructure (DB connection, AWS config)
Phase 2: Data ingestion logic (parsing, validation)
Phase 3: Transformation layer (ETL transformations)
Phase 4: Output handling (S3 writing, error logging)
```

---

## Configuración de Skills para Proyectos Diferentes

### Para Development/DevOps proyectos:

Edita `config/skills.json`:

```json
{
  "planner": {
    "enabled_skills": ["make-plan", "writing-plans", "release", "build-and-release"],
    "capabilities": ["automated versioning", "CI/CD pipelines"]
  }
}
```

### Para UI/UX proyectos:

Edita `config/skills.json`:

```json
{
  "planner": {
    "enabled_skills": ["make-plan", "impeccable"],
    "capabilities": ["UI audit", "design recommendations"]
  }
}
```

### Para Data/ML proyectos:

Edita `config/skills.json`:

```json
{
  "planner": {
    "enabled_skills": ["make-plan", "mem-search", "knowledge-agent"],
    "capabilities": ["pattern recognition", "memory-based reasoning"]
  }
}
```

---

## Commands Comandos Disponibles en CLI

| Comando | Acción |
|---------|---------|
| `/plan <request>` | Generar plan de implementación |
| `/execute <phase>` | Ejecutar fase específica |
| `/search-memory` | Buscar contexto en observaciones |
| `/backup` | Crear snapshot del database |
| `/memory-status` | Mostrar estado actual de memoria |

---

## Proceso Típico (Smart Planning Assistant)

```
User Request → Ultron/Jarvis:
   │
   ├── Step 1: Search Memory (mem-search skill)
   └── Find similar patterns, historical context
         │
         ├── Step 2: Generate Plan (make-plan skill)
         └── Create phased implementation plan
               │
               ├── Phase 1-6 executed with verification
               └── Each phase saves observation to database
                     │
                     └── Final state stored in knowledge base
```

---

## Tips para Maximizar la Utilidad

### 1. Use auto mode for permission management:
```env
PERMISSION_MODE=auto  # Minimiza prompts innecesarios
```

### 2. Enable memory sync for cross-session context:
```env
MEMORY_SYNC_TOKEN=your-cmem-sync-token
```

### 3. Create knowledge agents early:
- For repeated patterns, create AI-powered knowledge bases
- Helps with debugging and future planning

### 4. Use isolated worktrees for risky operations:
- Prevents accidental side effects
- Safer development workflow

---

**Next Steps**: Ejecuta `scripts/start-ultron.cmd` y empieza a construir tu primer proyecto con Ultron/Jarvis! 🚀
