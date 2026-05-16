# n7n

n7n is an AI-native workflow orchestration platform for engineering and DevOps workflows.

It is currently an n8n fork with a new product direction and the first working n7n node primitives. The goal is to evolve the workflow engine from deterministic automation into observable AI engineering orchestration: repository-aware agents, validation loops, repair metadata, approval gates, and execution traces.

n7n is not a chatbot wrapper. The product surface is the workflow graph.

## Current MVP

This repository now includes the first n7n-specific workflow nodes in `packages/nodes-base/nodes/N7n`:

- `n7n Generate Workflow`: turns an engineering request into editable workflow JSON
- `n7n Codex Task`: represents a Codex-style engineering agent task with planning, tools, shell execution, validation, repair, confidence, and artifact contracts
- `n7n Repository Analysis`: defines repository context requirements for agent execution
- `n7n Ruff Validation`: emits or runs Ruff validation with structured repair-loop output
- `n7n pytest Validation`: emits or runs pytest validation with structured repair-loop output
- `n7n mypy Validation`: emits or runs mypy validation with structured repair-loop output
- `n7n GitHub PR`: prepares pull request context and approval-aware PR actions
- `n7n OpenTelemetry Trace`: attaches trace-oriented workflow metadata

The validation nodes can run commands when `Run Command` is enabled. By default they run in planning mode, which makes imported workflows safe to inspect before executing shell commands.

Example importable workflows live in:

- [examples/workflows/autonomous-pr-review.json](examples/workflows/autonomous-pr-review.json)
- [examples/workflows/aws-fastapi-deployment.json](examples/workflows/aws-fastapi-deployment.json)

## What Works Now

The current implementation provides a usable backend-first MVP:

- n7n nodes are registered in `n8n-nodes-base`
- generated workflows contain connected n7n nodes
- engineering validation nodes produce structured status, command, repair policy, and execution metadata
- validation commands can execute and return `passed` or `failed` without hiding stdout/stderr
- Codex task nodes expose the execution contract needed for a real agent adapter
- example workflows can be imported and inspected in the editor after the package is built

What is not complete yet:

- no real Codex/OpenAI execution adapter is wired into `n7n Codex Task`
- no automatic import-to-canvas panel has been added yet
- no OpenTelemetry exporter is wired from the n7n trace node into the backend runtime yet
- repair loops are represented as structured workflow data but not yet scheduled automatically by the engine
- repository analysis currently emits context requirements, not parsed dependency graphs

That means this is no longer only documentation, but it is still an MVP foundation, not the full autonomous product.

## Product Direction

n7n extends the workflow concept from automation to AI-assisted autonomous engineering systems.

Traditional workflow tools expect humans to define every step. n7n workflows are designed so AI agents can:

- plan engineering work
- reason about repositories
- call tools
- run shell commands
- validate generated outputs
- retry with validation feedback
- generate artifacts
- report confidence
- emit execution traces
- request human approval before risky actions

## How n7n Differs From n8n

n8n focuses on:

- deterministic workflows
- manually configured automation
- integration-first automation
- broad business process automation

n7n focuses on:

- AI-generated workflow drafts
- Codex-style engineering agents
- validation and repair loops
- repository-aware orchestration
- OpenTelemetry-first AI execution visibility
- DevOps and software engineering workflows
- approval-gated autonomous execution

## Core Workflows

### Autonomous PR Review

Fetch a pull request, analyze repository context, run an engineering agent review, execute Ruff, mypy, and pytest, generate remediation suggestions, prepare GitHub comments behind approval, and emit trace metadata.

### Kubernetes Incident Investigation

Gather logs and traces, summarize failures, identify bottlenecks, propose fixes, generate infrastructure patch suggestions, and request approval before applying changes.

### AWS FastAPI Deployment

Analyze a FastAPI repository, generate an ECS deployment plan, validate Docker setup, propose Terraform updates, validate health checks, and trace the deployment lifecycle.

## Architecture

n7n is built around these layers:

1. Workflow Engine
2. AI Agent Layer
3. Validation Layer
4. Repair Loop System
5. Context Engineering Layer
6. Repository Analysis Layer
7. Observability and OpenTelemetry Layer
8. Human Approval Layer

See:

- [docs/architecture.md](docs/architecture.md)
- [docs/vision.md](docs/vision.md)
- [docs/roadmap.md](docs/roadmap.md)

## Development

n7n currently inherits the n8n monorepo toolchain.

Required:

- Node.js `>=22.16`
- pnpm `>=10.22`

Install dependencies:

```bash
pnpm install
```

Build:

```bash
pnpm build > build.log 2>&1
tail -n 20 build.log
```

Run checks:

```bash
pnpm typecheck
pnpm lint
pnpm test:affected
```

Package-level iteration for the first n7n nodes:

```bash
cd packages/nodes-base
pnpm typecheck
pnpm lint
```

Start the n7n runtime after building:

```bash
pnpm start:n7n
```

## Using the MVP

1. Install dependencies and build the repo.
2. Start n7n with `pnpm start`.
3. Import one of the example workflows from `examples/workflows`.
4. Inspect the connected n7n engineering nodes.
5. Keep validation nodes in planning mode while reviewing the graph.
6. Enable `Run Command` on validation nodes only in a trusted local or sandboxed runner environment.

## Safety

AI engineering workflows can affect source code, infrastructure, and production systems. n7n should require human approval before merging, deploying, deleting, rotating credentials, or changing production environments.

Validation and shell execution should run in a controlled workspace. Do not send secrets, credentials, or unrelated repository content to model providers.

## License

n7n is derived from n8n and keeps the upstream licensing model unless changed by the project maintainers. Review the repository license files before redistributing or offering hosted services.
