# Security Policy - Ultron/Jarvis AI Orchestrator Framework

## Supported Versions

| Version | Supported          | Not supported |
|---------| ------------------ | -------------- |
| v0.1.1 | :white_check_mark: | :x:           |
| v0.1.0-beta | :white_check_mark: | :x:           |

## Reporting a Vulnerability

**Current State:** v0.1.1 uses MOCK DATABASES (not production-ready)  
Vulnerabilities in mock implementations do NOT represent real security gaps, but should be reported per project policy below.

**Contact for Security Concerns:**
- Email: [REDACTED - Add your email]
- GitHub Issue: Create issue with security disclosure template

## Vulnerability Disclosure Policy (Mock DB)

Since v0.1.1 uses simulated databases in `src/database`:

1. **Password Storage**: Uses MD5 (not secure) - should be replaced with bcryptjs in future releases
2. **API Endpoints**: JWT tokens generated but user lookups are mocked (no real security risk yet)
3. **No Production Database**: `memory.db` is JSON/SQLite file - not production suitable

**Security Recommendations for Future Releases:**
- Replace MD5 with bcryptjs (`$2b$10$...` format in tests)
- Implement proper database layer (better-sqlite3 or migrate to Prisma if user approves)
- Add input validation on all API routes
- Review environment variables: `JWT_SECRET` currently hardcoded

## Security Testing

Run security checks before merging:

```bash
npm audit --dry-run  # Check for known vulnerabilities in dependencies
npm install -D eslint-plugin-security
npx eslint src/api/ routes/
```

---

**Last Updated**: 2026-11-08  
**Maintained by**: [Your GitHub Organization/Team]  
**Project URL**: https://github.com/SmelliW/ultron-orchestrator
