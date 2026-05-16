# n7n Vision

n7n exists to make AI-native engineering workflows reliable enough to operate as infrastructure.

n7n is Codex-first and provider-agnostic. It should make Codex-style engineering agents feel native to the workflow engine while keeping model providers replaceable through adapters.

Modern engineering work already spans repositories, CI systems, cloud services, logs, traces, incident tools, package managers, and code review. LLMs and coding agents can help with this work, but most agent systems are still isolated chat interfaces or one-off scripts.

n7n turns that work into observable workflows.

## Why n7n Exists

Software teams need AI systems that can do more than answer questions. They need systems that can:

- Understand a repository and its conventions
- Plan changes across files and services
- Run validation tools
- Interpret failures
- Repair outputs
- Ask for approval when risk increases
- Leave behind traces, logs, and explanations

The workflow model is a strong foundation for this because it makes execution explicit. n7n keeps that strength and adds AI-native capabilities around it.

## From Automation to Engineering Orchestration

Classic automation is deterministic: a human designs each step, the system executes the steps, and failures are handled with static branches.

AI-native orchestration is adaptive: a workflow can generate steps, choose context, validate outputs, repair failures, and explain what happened. This does not remove the need for structure. It makes structure more important.

n7n is built on the idea that autonomous engineering work must be:

- Structured as workflows
- Grounded in repository context
- Validated by real tools
- Observable through traces and logs
- Governed by human approval where necessary

## What n7n Is Not

n7n is not a generic chatbot wrapper.

It should not optimize for open-ended conversation as the primary product surface. Conversation may be useful for workflow creation, explanation, and approval, but the core product is orchestration.

n7n is also not a black-box agent runner. Agent actions should be represented in the workflow graph, tied to validation, and visible in telemetry.

Codex should not be treated as naive prompt-response generation. n7n should use Codex-style agents for iterative execution: planning, repository-aware reasoning, tool calling, shell execution, validation, autonomous retries, artifact generation, confidence reporting, and trace emission.

## Product Feel

n7n should feel like AI-native engineering infrastructure:

- Precise
- Observable
- Repository-aware
- Validation-driven
- Built for engineers
- Useful in CI, DevOps, code review, and incident workflows

The ideal user experience is not “chat with your automation.” It is “describe the engineering outcome, inspect the generated workflow, run it with traces, and let the system validate and repair within clear bounds.”

## Philosophy

### Workflows Are Control Planes

The workflow graph is where intent, execution, dependencies, and control flow become inspectable. Agents can generate or modify workflows, but the graph remains the operational artifact.

### Agents Need Boundaries

AI agents are powerful when they have tools, context, and feedback. They are risky when they act without constraints. n7n should give agents bounded tasks, typed inputs, validation checks, approval gates, and observable execution spans.

### Validation Is Part of Intelligence

An AI-generated answer is incomplete until it has been validated. For engineering workflows, validation means running real tools: tests, linters, type checkers, build systems, deployment checks, policy checks, and runtime probes.

### Context Is a Product Surface

The quality of agent output depends on the quality of context. n7n should treat context selection, compression, provenance, and safety as first-class product and architecture concerns.

### Observability Is Required

AI execution without observability is not suitable for engineering infrastructure. Token usage, latency, retries, tool calls, failure spans, generated artifacts, and repair attempts must be visible.

## Long-Term Direction

n7n should become a platform for:

- AI-generated workflow graphs
- Agentic code review and implementation workflows
- Repository-aware automation
- CI and deployment repair loops
- Cloud and Kubernetes debugging workflows
- Multi-agent engineering operations
- OpenTelemetry-native AI execution observability

The long-term direction is autonomous engineering workflows, observable AI agents, distributed workflow orchestration, repository-aware agents, AI DevOps pipelines, engineering copilots, multi-agent systems, and AI-native infrastructure automation.

The long-term product should help teams build reliable autonomous engineering systems while preserving reviewability, operational control, and trust.
