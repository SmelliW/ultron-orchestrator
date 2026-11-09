# Contributing to Ultron/Jarvis AI Orchestrator Framework

Welcome! Thank you for your interest in contributing to this project.

## 🤖 What is Ultron?

An AI Personal Orchestrator that uses Claude Code skills to:
- **Plan**: Generate progressive implementation plans
- **Execute**: Run phases with isolated workspaces
- **Remember**: Store observations in persistent memory

## 🐛 Bug Reports

Report bugs via GitHub Issues with:

1. **Description** - Clear steps to reproduce
2. **Expected Behavior** - What should happen
3. **Actual Behavior** - What actually happens
4. **Environment** - Node version, OS, dependencies used

## 💡 Feature Requests

Submit feature requests as GitHub Issues with the `enhancement` label:

- Describe the desired behavior clearly
- Include any relevant documentation/examples
- Provide use cases where this would help

## 🐛 Pull Request Guidelines

### Before Submitting a PR:

1. **Fork** the repository and create your branch from `main`
2. **Run Tests** (when tests exist):
   ```bash
   npm test  # Run existing mock validations
   ```
3. **Commit with Clear Messages**:
   ```bash
   git commit -m "feat: add memory manager backup functionality"
   ```
4. **Push to Your Branch**:
   ```bash
   git push origin your-branch-name
   ```
5. **Open a Pull Request**

### PR Structure:

```
Fix: memory_manager_backup.sh
--------------------
- Add backup/restore commands
- Save backup files in /backup/ directory
- Handle concurrent backup requests

Fixes: #XXX (add issue number if applicable)
```

## 📝 Development Standards

### Code Style

- Use TypeScript with ES6+ syntax
- Follow existing patterns in `src/`
- Add comments for non-obvious logic
- Write tests using `npm test` (mock validations)

### Branch Naming Conventions

- Features: `feature/your-feature-name`
- Bug fixes: `fix/bug-description`
- Databases: `db/your-change`
- API: `api/endpoints-update`

## 🎯 Project Structure

```
src/                      # Main application code
├── planner/              # Plan generation
├── executor/             # Execution engine
├── memory_manager/       # Context persistence
└── api/routes/           # REST endpoints

test/                     # Unit tests
scripts/                  # Build & test scripts
```

## 📚 Resources

- [Contributor Covenant](CODE_OF_CONDUCT.md) - Our Code of Conduct
- [GitHub Help](https://docs.github.com/get-started/getting-started-with-contributing-to-open-source/) - Contributing Guide
- [Ultron API Documentation](#api-reference) - For contributing to the API

## 🤝 Questions?

Contact: [REDACTED with your team email]

---

**Last Updated**: 2026-11-08
