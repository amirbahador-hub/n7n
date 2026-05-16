# workflowDocument Store Agent Guidelines

## Core Pattern: Apply/Public Method Split

Every composable in this folder follows a two-layer pattern:

**Public methods** represent user intent. They handle normalization, deduplication, and preparation, then call apply methods internally.

**Apply methods** are private and are the only functions that mutate refs. Each apply method writes to the ref and fires an event hook. Never expose apply methods from the composable.

```text
Component -> publicMethod() -> normalize -> applyXxx() -> ref + event hook
```

This split supports future CRDT work: local user actions, remote sync, and undo/redo converge on the same private apply methods.

## Event Hooks

Every composable exposes change notifications via `createEventHook` from `@vueuse/core`. Event payloads must extend `ChangeEvent` from `./types.ts`.

```typescript
import { createEventHook } from '@vueuse/core';
import type { ChangeEvent } from './types';

type MyChangeEvent = ChangeEvent<{ id: string }>;
const onMyChange = createEventHook<MyChangeEvent>();
```

- Fire `void onMyChange.trigger(...)` inside every apply method.
- Expose only the `.on` subscriber: `onMyChange: onMyChange.on`.
- Use `CHANGE_ACTION.ADD | UPDATE | DELETE` for the `action` field.

## Adding a New Composable

1. Create an event hook with typed payload extending `ChangeEvent`.
2. Write private `apply*()` methods that mutate refs and fire the hook.
3. Write public methods that normalize input and call apply methods.
4. Return readonly refs, public methods, and `onXxxChange: hook.on`.
5. Never return apply methods.

## Anti-Patterns

| Do Not | Do Instead |
|--------|------------|
| Mutate refs outside apply methods | Route ref writes through apply methods |
| Expose apply methods | Keep apply methods private |
| Use action routers for local changes | Let public methods call apply directly |
| Use global event buses | Use scoped `createEventHook` |
| Import global stores inside composables | Inject dependencies through params |

## Dependency Injection

Composables receive external dependencies as constructor params, not global store imports.

```typescript
export function useWorkflowDocumentFoo(deps: {
	getNodeByName: (name: string) => INodeUi | undefined;
}) {
	// ...
}
```

## Reference

See `useWorkflowDocumentActive.ts` for a compact implementation of the apply/public pattern with event hooks.
