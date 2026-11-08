# ULTRON - Contributing Guide

## 🎯 Development Workflow

### Making Changes:

```bash
# 1. Make your changes
nano src/index.ts
```

### Testing:

```bash
npm start
# or in dev mode:
npm run dev
```

### Committing (ULTRON Versioning):

**For Bug Fixes:**
```bash
git commit -m 'fix(planner): handle edge case in complex task parsing'
```

**For New Features:**
```bash
git commit -m 'feat(memory-manager): add knowledge-agent integration'
```

**Commit Convention:**
- `fix()` - Bug fixes
- `feat()` - New features
- `docs()` - Documentation changes
- `test()` - Test additions/modifications
- `refactor()` - Code restructuring
- `build()` - Build/dependency changes
- `ci()` - CI/CD changes

### Version Bumping:

```bash
# Update version in package.json
nano package.json

# Create release commit
npm version <new-version> --no-git-tag-version
git commit -m 'vX.Y.Z: Release ULTRON X.Y.Z'
```

## Release Process (v1.0.0 Target)

| Step | Command |
|------|---------|
| 1 | Update package.json version in `package.json` |
| 2 | Run tests: `npm test` |
| 3 | Commit with proper message |
| 4 | Push to main branch: `git push origin main` |
| 5 | Create GitHub Release: `gh release create v1.0.0 ...` |

## GitHub Actions (Planned for v1.0.0)

```yaml
# .github/workflows/release.yml (future)
name: ULTRON Release

on: push
  branches: [ main ]
    if: github.ref == 'refs/heads/main' && startsWith(github.ref, 'refs/tags/v')

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with: { node-version: '20' }
        
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Release to GitHub
        uses: softprops/action-gh-release@v1
```

## Security Checklist

- [ ] No secrets in `.git` (use `.env` for sensitive data)
- [ ] Updated package.json dependencies
- [ ] Reviewed CHANGELOG.md before release
- [ ] Changelog mentions breaking changes clearly

---

**Contributed by**: Claude Code  
**Framework**: ULTRON v0.1.0-beta
