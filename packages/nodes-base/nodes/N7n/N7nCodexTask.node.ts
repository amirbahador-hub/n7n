import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { n7nNodeDefaults, nonEmptyString, stringArray, withN7nPayload } from './shared';

export class N7nCodexTask implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'n7n Codex Task',
		name: 'n7nCodexTask',
		icon: n7nNodeDefaults.icon,
		iconColor: n7nNodeDefaults.iconColor,
		group: n7nNodeDefaults.group,
		version: 1,
		description: 'Describe a repository-aware coding agent task for n7n orchestration',
		defaults: {
			name: 'Codex Task',
		},
		inputs: n7nNodeDefaults.inputs,
		outputs: n7nNodeDefaults.outputs,
		properties: [
			{
				displayName: 'Task',
				name: 'task',
				type: 'string',
				typeOptions: { rows: 5 },
				default: '',
				required: true,
				description: 'Engineering task for a coding agent',
			},
			{
				displayName: 'Provider',
				name: 'provider',
				type: 'options',
				options: [
					{ name: 'OpenAI', value: 'openai' },
					{ name: 'Provider Adapter', value: 'adapter' },
					{ name: 'Local Adapter', value: 'local' },
					{ name: 'Unbound', value: 'unbound' },
				],
				default: 'openai',
				description: 'Provider adapter to use when agent execution is enabled',
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'string',
				default: '',
				description: 'Optional model identifier for the selected provider',
			},
			{
				displayName: 'Execution Mode',
				name: 'executionMode',
				type: 'options',
				options: [
					{ name: 'Plan Only', value: 'planOnly' },
					{ name: 'Plan and Generate Artifacts', value: 'planAndGenerate' },
					{ name: 'Plan, Execute, Validate, and Repair', value: 'fullLoop' },
				],
				default: 'fullLoop',
				description: 'How far the Codex-style agent should proceed when an executor is attached',
			},
			{
				displayName: 'Allowed Capabilities',
				name: 'allowedCapabilities',
				type: 'multiOptions',
				options: [
					{ name: 'Task Planning', value: 'taskPlanning' },
					{ name: 'Code Generation', value: 'codeGeneration' },
					{ name: 'Shell Execution', value: 'shellExecution' },
					{ name: 'Repository Analysis', value: 'repositoryAnalysis' },
					{ name: 'Validation Execution', value: 'validationExecution' },
					{ name: 'Artifact Generation', value: 'artifactGeneration' },
				],
				default: [
					'taskPlanning',
					'codeGeneration',
					'shellExecution',
					'repositoryAnalysis',
					'validationExecution',
					'artifactGeneration',
				],
				description: 'Capabilities the agent executor may use for this task',
			},
			{
				displayName: 'Repository URL',
				name: 'repositoryUrl',
				type: 'string',
				default: '',
				description: 'Optional repository URL for task context',
			},
			{
				displayName: 'System Context',
				name: 'systemContext',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description: 'Additional task constraints, repository conventions, or execution policy',
			},
			{
				displayName: 'Max Repair Attempts',
				name: 'maxRepairAttempts',
				type: 'number',
				default: 2,
				typeOptions: { minValue: 0 },
				description: 'Maximum repair attempts allowed when downstream validation fails',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData = items.map((item, itemIndex) => {
			const task = String(this.getNodeParameter('task', itemIndex));
			const provider = String(this.getNodeParameter('provider', itemIndex));
			const model = nonEmptyString(this.getNodeParameter('model', itemIndex));
			const executionMode = String(this.getNodeParameter('executionMode', itemIndex));
			const allowedCapabilities = stringArray(
				this.getNodeParameter('allowedCapabilities', itemIndex, []),
			);
			const repositoryUrl = nonEmptyString(this.getNodeParameter('repositoryUrl', itemIndex));
			const systemContext = nonEmptyString(this.getNodeParameter('systemContext', itemIndex));
			const maxRepairAttempts = Number(this.getNodeParameter('maxRepairAttempts', itemIndex));

			return withN7nPayload(item, 'codexTask', {
				task,
				provider,
				model,
				repositoryUrl,
				systemContext,
				status: 'pending',
				executionMode,
				allowedCapabilities,
				agentModel: {
					style: 'codex',
					provider,
					model: model ?? 'provider-default',
					adapterRequired: true,
				},
				planning: {
					status: 'pending',
					outputs: ['plan', 'riskAssessment', 'validationStrategy', 'approvalRequirements'],
				},
				toolExecution: {
					status: 'pending',
					records: ['toolName', 'inputSummary', 'status', 'durationMs', 'outputSummary'],
				},
				shellExecution: {
					status: 'pending',
					records: ['command', 'workingDirectory', 'exitCode', 'durationMs', 'stdout', 'stderr'],
				},
				repairPolicy: {
					enabled: maxRepairAttempts > 0,
					maxAttempts: maxRepairAttempts,
					feedbackSources: ['validationFailures', 'shellErrors', 'toolErrors', 'traceSummary'],
				},
				observability: {
					spanName: 'n7n.codex.task',
					metrics: ['tokenUsage', 'latencyMs', 'retryCount', 'toolCallCount', 'confidence'],
				},
				outputContract: {
					summary: 'string',
					structuredReasoning: 'string',
					confidence: 'number',
					changedFiles: 'string[]',
					patch: 'string',
					artifacts: 'Array<{ name: string; type: string; uri?: string; content?: string }>',
					validationHints: 'string[]',
				},
			});
		});

		return [returnData];
	}
}
