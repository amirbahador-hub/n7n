# Instance AI Development Guidelines

Instance AI provides backend capabilities for AI-assisted workflows. In n7n, these capabilities must remain provider-agnostic and should support Codex-style engineering agents, OpenAI agents, and future AI coding systems.

## Linear Tickets

- Never set priority to Urgent (1). Use High (2) as the maximum.

## Engineering Standards

Follow `docs/ENGINEERING.md` for all implementation work. Key rules:

- No `any`, no avoidable `as` casts. Use discriminated unions, type guards, and `satisfies`.
- Zod schemas are the source of truth. Infer types with `z.infer<>`.
- Shared event types, API shapes, and enums belong in `@n8n/api-types`.
- Test behavior, not implementation.
- Tools are thin wrappers: validate input, call service, return output.
- Respect layer boundaries: tool -> service interface -> adapter -> n8n internals.

## Architecture

Read these docs before implementation:

- `docs/architecture.md`
- `docs/streaming-protocol.md`
- `docs/tools.md`
- `docs/memory.md`
- `docs/filesystem-access.md`
- `docs/sandboxing.md`
- `docs/configuration.md`

## Provider-Agnostic Agent Work

- Model providers are adapters, not architecture.
- Prefer Codex/OpenAI-oriented engineering workflows for n7n-specific examples.
- Keep tool calling, memory, streaming, sandboxing, and event schemas provider-neutral.
- Record provider/model metadata in structured events without coupling behavior to one vendor.

## E2E Testing

Tests live in `packages/testing/playwright/tests/e2e/instance-ai/`.

Use provider-neutral naming for new tests and fixtures. If a test needs a real model provider, make the provider explicit in configuration and keep the test behavior focused on the n7n contract.

See `docs/e2e-tests.md` for the recording/replay architecture.

## Key Conventions

- Event schema: `{ type, runId, agentId, payload? }`
- `POST /chat/:threadId` returns `{ runId }`; it is not a stream.
- `SSE /events/:threadId` delivers all events.
- Run lifecycle: `run-start` -> events -> `run-finish`.
- Planned tasks use a plan tool for multi-step work.
- Sub-agents are bounded and should not recursively delegate unless the orchestration layer explicitly supports it.
- Memory must be scoped and observable.
