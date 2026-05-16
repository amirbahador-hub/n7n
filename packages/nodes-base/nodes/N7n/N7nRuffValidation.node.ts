import { exec } from 'node:child_process';
import type { ExecException } from 'node:child_process';

import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { buildValidationPayload, n7nNodeDefaults, nonEmptyString, withN7nPayload } from './shared';

export class N7nRuffValidation implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'n7n Ruff Validation',
		name: 'n7nRuffValidation',
		icon: n7nNodeDefaults.icon,
		iconColor: n7nNodeDefaults.iconColor,
		group: n7nNodeDefaults.group,
		version: 1,
		description: 'Represent a Ruff validation step with repair-loop metadata',
		defaults: {
			name: 'Ruff Validation',
		},
		inputs: n7nNodeDefaults.inputs,
		outputs: n7nNodeDefaults.outputs,
		properties: validationProperties('ruff check .'),
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return [await buildValidationItems(this, 'ruffValidation', 'ruff')];
	}
}

function validationProperties(defaultCommand: string): INodeTypeDescription['properties'] {
	return [
		{ displayName: 'Command', name: 'command', type: 'string', default: defaultCommand },
		{ displayName: 'Working Directory', name: 'workingDirectory', type: 'string', default: '.' },
		{
			displayName: 'Run Command',
			name: 'runCommand',
			type: 'boolean',
			default: false,
			description:
				'Whether to execute the command. When disabled, the node emits a validation plan only.',
		},
		{
			displayName: 'Timeout Seconds',
			name: 'timeoutSeconds',
			type: 'number',
			default: 120,
			typeOptions: { minValue: 1 },
			displayOptions: {
				show: {
					runCommand: [true],
				},
			},
		},
		{
			displayName: 'Repair Target',
			name: 'repairTarget',
			type: 'string',
			default: 'codexTask',
			description: 'Previous agent output to repair when this validation fails',
		},
		{
			displayName: 'Max Repair Attempts',
			name: 'maxRepairAttempts',
			type: 'number',
			default: 2,
			typeOptions: { minValue: 0 },
		},
	];
}

function buildValidationItems(
	executeFunctions: IExecuteFunctions,
	key: string,
	tool: string,
): Promise<INodeExecutionData[]> {
	return Promise.all(
		executeFunctions.getInputData().map(async (item, itemIndex) => {
			const command = String(executeFunctions.getNodeParameter('command', itemIndex));
			const workingDirectory = nonEmptyString(
				executeFunctions.getNodeParameter('workingDirectory', itemIndex),
			);
			const runCommand = Boolean(executeFunctions.getNodeParameter('runCommand', itemIndex));
			const timeoutSeconds = Number(
				executeFunctions.getNodeParameter('timeoutSeconds', itemIndex, 120),
			);
			const repairTarget = nonEmptyString(
				executeFunctions.getNodeParameter('repairTarget', itemIndex),
			);
			const maxRepairAttempts = Number(
				executeFunctions.getNodeParameter('maxRepairAttempts', itemIndex),
			);
			const validationPayload = buildValidationPayload({
				tool,
				command,
				workingDirectory,
				repairTarget,
				maxRepairAttempts,
			});

			const execution = runCommand
				? await executeValidationCommand(command, workingDirectory ?? '.', timeoutSeconds)
				: {
					mode: 'plan',
					status: 'pending',
					summary: 'Command execution is disabled. Enable Run Command to validate outputs.',
				};

			return withN7nPayload(item, key, {
				...validationPayload,
				execution,
			});
		}),
	);
}

async function executeValidationCommand(
	command: string,
	workingDirectory: string,
	timeoutSeconds: number,
): Promise<IDataObject> {
	const startedAt = Date.now();

	return await new Promise((resolve) => {
		exec(
			command,
			{
				cwd: workingDirectory,
				timeout: timeoutSeconds * 1000,
			},
			(error: ExecException | null, stdout, stderr) => {
				const durationMs = Date.now() - startedAt;
				const exitCode = error?.code ?? 0;
				const status = error ? 'failed' : 'passed';

				resolve({
					mode: 'executed',
					status,
					exitCode,
					durationMs,
					stdout: stdout.trim(),
					stderr: stderr.trim(),
					summary:
						status === 'passed'
							? `Validation command passed in ${durationMs}ms.`
							: `Validation command failed with exit code ${exitCode}.`,
				});
			},
		);
	});
}

export { buildValidationItems, validationProperties };
