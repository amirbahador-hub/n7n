# n7n Roadmap

This roadmap describes the intended fork-specific direction for n7n. It is organized around incremental platform capabilities rather than a fixed release schedule.

## Phase 1: MVP Foundation

Goal: establish the first AI-native engineering workflow primitives while keeping the system modular and close to the existing n8n architecture.

Planned capabilities:

- AI workflow generation from natural language requests
- Codex-first integration for engineering tasks
- OpenTelemetry tracing for workflow, agent, validation, and repair execution
- Validation loops for generated outputs
- Initial engineering AI nodes:
  - Codex Task Node
  - Repository Analysis Node
  - Ruff Validation Node
  - pytest Validation Node
  - mypy Validation Node
  - GitHub PR Node
  - OpenTelemetry Trace Node

Expected outcomes:

- Users can describe an engineering workflow and receive editable workflow JSON
- Generated workflows can include validation and repair steps
- Codex nodes expose planning, tool execution, shell execution, validation feedback, retry, confidence, and artifact contracts
- Node execution emits structured metadata suitable for traces
- The architecture avoids hardcoding one model provider

## Phase 2: Repository-Aware Engineering Workflows

Goal: make n7n useful for real engineering repositories and DevOps environments.

Planned capabilities:

- Repository analysis and framework detection
- Dependency graph extraction
- Relevant file selection
- Semantic context optimization
- Architecture summaries
- Pull request context generation
- AWS engineering workflows for deployment, diagnostics, and operational checks
- Improved validation result parsing and repair prompts

Expected outcomes:

- Agents receive smaller and more relevant context packs
- Workflows can reason about repo structure, package managers, and test tools
- AWS-focused workflows can inspect deployment state, logs, configuration, and failure signals

## Phase 3: Autonomous Multi-Agent Orchestration

Goal: support complex engineering operations with multiple specialized agents and distributed execution.

Planned capabilities:

- Multi-agent orchestration
- Autonomous debugging workflows
- Distributed execution
- Agent roles for planning, implementation, validation, review, and operations
- Retry graphs and repair history visualization
- Cross-workflow trace correlation
- Human approval policies for high-impact actions

Expected outcomes:

- n7n can coordinate multiple agents across a single engineering objective
- Debugging workflows can inspect failures, propose fixes, validate changes, and request approval
- Execution is traceable across agents, validators, repositories, and infrastructure systems

## Guiding Priorities

- Maintain TypeScript consistency with n8n
- Keep architecture modular
- Design reusable abstractions
- Avoid hardcoding model providers
- Minimize frontend complexity initially
- Prioritize backend workflow execution primitives
- Build for future multi-agent support
- Treat observability, validation, and human approval as core infrastructure
