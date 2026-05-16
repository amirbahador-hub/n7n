<script setup lang="ts">
import type { MCPOnboardingClient } from './types';

defineProps<{
	agent: MCPOnboardingClient;
}>();
</script>

<template>
	<span :class="$style.logo" aria-hidden="true">
		<span :class="$style.mark">
			{{ agent === 'cursor' ? 'Cu' : agent === 'chatgpt' ? 'AI' : 'Cx' }}
		</span>
	</span>
</template>

<style lang="scss" module>
.logo {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: var(--mcp-agent-logo-size, 22px);
	height: var(--mcp-agent-logo-size, 22px);
	border-radius: var(--radius--sm);
	background: var(--background--surface);
	border: 1px solid var(--border-color--subtle);
	color: var(--icon-color--strong);
}

.mark {
	font-size: var(--font-size--3xs);
	font-weight: var(--font-weight-bold);
	line-height: 1;
}
</style>
