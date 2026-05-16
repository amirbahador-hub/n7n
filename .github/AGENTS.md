@../AGENTS.md

## .github Quick Reference

This folder contains CI/CD, release, and automation infrastructure.

### Key Files

| File/Folder | Purpose |
|-------------|---------|
| `WORKFLOWS.md` | Complete CI/CD documentation |
| `workflows/` | GitHub Actions workflows |
| `actions/` | Reusable composite actions |
| `scripts/` | Release, Docker, and automation scripts |
| `CODEOWNERS` | Team review ownership |

### Workflow Naming

| Prefix | Purpose |
|--------|---------|
| `test-` | Testing |
| `ci-` | Continuous integration |
| `util-` | Utilities |
| `build-` | Build processes |
| `release-` | Release automation |
| `sec-` | Security scanning |

Reusable workflows should use `-reusable` or `-callable` suffixes.

### Agent Automation

GitHub automation must be provider-agnostic unless it is explicitly scoped to a provider adapter. Prefer Codex-oriented task execution and neutral names such as agent task runner, AI coding agent, or engineering agent.

Do not add Claude-branded workflow names, branch names, templates, or scripts for n7n automation.

### Common Tasks

**Add workflow:** Create in `workflows/`, document in `WORKFLOWS.md`.

**Add script:** Create `.mjs` in `scripts/`, document in `WORKFLOWS.md`.
