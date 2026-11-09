# 🤖 ULTRON - AI Personal Orchestrator Framework

**Version**: 0.1.1 (PATCH) | **AI Brain**: Claude Code (qwen3.5:4b)  
**Skills**: Writing Plans, Executing Plans, Memory Management  

## 📦 Version History

| Version | Date | Description |
|---------|------|-------------|
| v0.1.1 | 2026-11-08 | PATCH - Test validations, memory manager fix, known limitations documented |
| v0.1.0-beta | 2026-11-07 | Initial release - Basic orchestrator framework with planning & memory management |
| v1.0.0 | TBD | Stable release - Production-ready with CI/CD integration |

## 📝 Known Limitations (v0.1.1)

> ⚠️ **IMPORTANT**: This version uses SIMPLE MOCK DATABASES instead of production database layers

**Database Implementation:**
- Uses async/await simulated functions in `src/database`
- NO Prisma, NO MongoDB, NO MySQL - simple mocks for development
- Users registered with mock data (admin + 3 demo users)
- JWT tokens work but user lookups are hardcoded to existing mock users

**Why not production DB?**  
As per user instruction: *"no utilices prisma para el proyecto, el uso del mismo ha provocado multiples errores y loops sin sentido"*  
Alternative implementations available (better-sqlite3, mongoose, prisma) - pending v.0.2.0 decision

**Workarounds:**
```typescript
// Current mock implementation
async getUserByEmail(email: string): Promise<any> {
  return { id: 1, email, name: 'Juan' }; // Static mock
}
```

---

## 🚀 Quick Start, Debugging

## 🎯 Vision

An intelligent agent that orchestrates complex projects by:
1. **Planning**: Generating progressive implementation plans with validation at each phase
2. **Executing**: Running phases with isolated workspaces when needed
3. **Remembering**: Storing observations in persistent memory database for context management

---

## 📦 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Ultron / Jarvis                          │
│                     (Central Orchestrator)                   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴─────────────────────┐
        │                                             │
   ┌────▼────┐                            ┌──────────▼──────┐
   │ Planner │                            │ Memory Manager  │
   │(Skills: │                            │ (Claude Mem)     │
   │ make-   │                            │                  │
   │ plan,   │                            └──────────────────┘
   │ writing-│
   │ plans)  │                                             │
        │                                             │
   ┌────▼────┐                                          │
   │ Executor│───────────→ Execute                      │
   │(Skills: │                                           │
   │ do,     │                                          │
   │ execute-)│                                         │
   └─────────┘                                          │
```

---

## 🚀 Quick Start

```bash
# Clone or setup project folder
cd "C:\Users\garci\Desktop\Ollama Claude Code Project XCore"

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Configure your memory token and Ollama model
nano .env  # Edit as needed

# Run Ultron/Jarvis
npm start
```

---

## 🛠️ Skills Integration

| Component | Skills Used | Purpose |
|-----------|-------------|---------|
| **Planner** | make-plan, writing-plans, executing-plans | Generates progressive implementation plans with phases |
| **Executor** | do, execution-plans, use-git-worktrees | Executes plans with isolation when needed |
| **Memory Manager** | mem-search, backup-setup, knowledge-agent | Persistent observation database for context |

---

## 📝 Usage Examples

### 1. Request a Complex Task

```
"Build a REST API that manages users with authentication and pagination"
```

Ultron will:
1. Search memory for similar projects (`mem-search`)
2. Create implementation plan (6 phases)
3. Execute each phase sequentially
4. Save observations to database (`backup-setup`)

### 2. Debug an Issue

```
"The API is not returning paginated results"
```

Ultron will:
1. Search memory for debugging history (`mem-search`)
2. Create diagnostic plan using systematic-debugging skill
3. Execute and verify fixes
4. Update knowledge base (`knowledge-agent`)

---

## 🧠 How It Works (Smart Planning Assistant #8)

1. **Natural Language → Plan**: User request converted to technical phases
2. **Incremental Validation**: Each phase verified before proceeding
3. **Context-Aware**: Memory search provides historical context
4. **Isolated Execution**: Git worktrees prevent side effects
5. **Persistent Learning**: Every execution saved as memory observation

---

## 🔒 Context Memory Manager #9

**Key Features**:
- **Permission Optimization**: Auto-mode prevents unnecessary prompts
- **Relevant Context**: Only searches relevant memories (`mem-search`)
- **Token Efficiency**: Prioritizes information, avoids useless prompts
- **Backup/Restore**: Full database snapshot capability

---

## 📁 Project Structure

```
C:\Users\garci\Desktop\Ollama Claude Code Project XCore\
├── src/\
│   ├── index.ts              # Main orchestrator (brain)
│   ├── planner/\
│   │   └── planner.ts        # Plan generation engine
│   ├── executor/\
│   │   └── executor.ts       # Execution engine
│   └── memory_manager/\
│       └── memory_manager.ts # Memory management
├── config/\
│   └── skills.json           # Skill configuration
├── scripts/
│   └── run-ultron.sh         # CLI entry point
├── package.json
└── README.md
```

---

## 🔗 Related Projects

This implements:
- **Project #8**: Smart Planning Assistant (Planning-to-Execution Engine)
- **Project #9**: Context Memory Manager

Combined with custom orchestrator patterns for Ultron/Jarvis.

---

**Generated by**: Claude Code  
**Skills used**: Writing Plans, Executing Plans, Memory Management
