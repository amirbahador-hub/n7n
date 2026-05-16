import {
	NodeConnectionTypes,
	type IDataObject,
	type INodeExecutionData,
	type INodeTypeDescription,
} from 'n8n-workflow';

export const n7nNodeDefaults = {
	icon: 'fa:code-branch' as INodeTypeDescription['icon'],
	iconColor: 'dark-blue' as INodeTypeDescription['iconColor'],
	group: ['transform'] as INodeTypeDescription['group'],
	inputs: [NodeConnectionTypes.Main] as INodeTypeDescription['inputs'],
	outputs: [NodeConnectionTypes.Main] as INodeTypeDescription['outputs'],
};

export function withN7nPayload(
	item: INodeExecutionData,
	key: string,
	payload: IDataObject,
): INodeExecutionData {
	return {
		...item,
		json: {
			...item.json,
			n7n: {
				...(isDataObject(item.json.n7n) ? item.json.n7n : {}),
				[key]: payload,
			},
		},
	};
}

export function isDataObject(value: unknown): value is IDataObject {
	return value !== null && typeof value === 'object' && !Array.isArray(value);
}

export function nonEmptyString(value: unknown): string | undefined {
	if (typeof value !== 'string') return undefined;

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

export function splitLines(value: string): string[] {
	return value
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0);
}

export function stringArray(value: unknown): string[] {
	if (!Array.isArray(value)) return [];

	return value.filter((item): item is string => typeof item === 'string');
}

export function buildValidationPayload(input: {
	tool: string;
	command: string;
	workingDirectory?: string;
	repairTarget?: string;
	maxRepairAttempts: number;
}): IDataObject {
	return {
		tool: input.tool,
		command: input.command,
		workingDirectory: input.workingDirectory ?? '.',
		status: 'pending',
		repairTarget: input.repairTarget ?? 'previous-agent-output',
		repairPolicy: {
			enabled: input.maxRepairAttempts > 0,
			maxAttempts: input.maxRepairAttempts,
			feedbackFields: ['tool', 'command', 'exitCode', 'summary', 'stderr', 'stdout'],
		},
		outputContract: {
			status: 'passed | failed | skipped',
			exitCode: 'number',
			durationMs: 'number',
			summary: 'string',
			stdout: 'string',
			stderr: 'string',
		},
	};
}
