import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	n7nNodeDefaults,
	nonEmptyString,
	splitLines,
	stringArray,
	withN7nPayload,
} from './shared';

export class N7nGenerateWorkflow implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'n7n Generate Workflow',
		name: 'n7nGenerateWorkflow',
		icon: n7nNodeDefaults.icon,
		iconColor: n7nNodeDefaults.iconColor,
		group: n7nNodeDefaults.group,
		version: 1,
		description: 'Generate an editable engineering workflow draft from a natural language request',
		defaults: {
			name: 'Generate Workflow',
		},
		inputs: n7nNodeDefaults.inputs,
		outputs: n7nNodeDefaults.outputs,
		properties: [
			{
				displayName: 'Request',
				name: 'request',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				placeholder: 'Create a workflow to review Python pull requests using Ruff and pytest.',
				description: 'Natural language engineering workflow request',
			},
			{
				displayName: 'Repository URL',
				name: 'repositoryUrl',
				type: 'string',
				default: '',
				placeholder: 'https://github.com/example/service',
				description: 'Optional repository URL to include in the generated workflow context',
			},
			{
				displayName: 'AWS Environment Info',
				name: 'awsEnvironmentInfo',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Optional AWS account, region, service, or deployment context',
			},
			{
				displayName: 'Validation Tools',
				name: 'validationTools',
				type: 'multiOptions',
				options: [
					{ name: 'Ruff', value: 'ruff' },
					{ name: 'pytest', value: 'pytest' },
					{ name: 'mypy', value: 'mypy' },
				],
				default: ['ruff', 'pytest'],
				description: 'Validation nodes to include in the generated workflow draft',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData = items.map((item, itemIndex) => {
			const request = String(this.getNodeParameter('request', itemIndex));
			const repositoryUrl = nonEmptyString(this.getNodeParameter('repositoryUrl', itemIndex));
			const awsEnvironmentInfo = nonEmptyString(
				this.getNodeParameter('awsEnvironmentInfo', itemIndex),
			);
			const validationTools = stringArray(this.getNodeParameter('validationTools', itemIndex, []));
			const generatedWorkflow = buildWorkflowDraft({
				request,
				repositoryUrl,
				awsEnvironmentInfo,
				validationTools,
			});

			return withN7nPayload(item, 'generatedWorkflow', generatedWorkflow);
		});

		return [returnData];
	}
}

function buildWorkflowDraft(input: {
	request: string;
	repositoryUrl?: string;
	awsEnvironmentInfo?: string;
	validationTools: string[];
}): IDataObject {
	const nodes = [
		node('Repository Analysis', 'n8n-nodes-base.n7nRepositoryAnalysis', 0, 0, {
			repositoryUrl: input.repositoryUrl ?? '',
			includeDependencyGraph: true,
			includeArchitectureSummary: true,
		}),
		node('Codex Task', 'n8n-nodes-base.n7nCodexTask', 260, 0, {
			task: input.request,
			repositoryUrl: input.repositoryUrl ?? '',
			systemContext: buildSystemContext(input),
		}),
		...input.validationTools.map((tool, index) =>
			node(validationNodeName(tool), validationNodeType(tool), 520 + index * 260, 0, {
				command: validationCommand(tool),
				workingDirectory: '.',
				runCommand: false,
				timeoutSeconds: 120,
				maxRepairAttempts: 2,
			}),
		),
		node(
			'OpenTelemetry Trace',
			'n8n-nodes-base.n7nOpenTelemetryTrace',
			520 + input.validationTools.length * 260,
			0,
			{
				spanName: 'n7n.workflow.generated',
				eventName: 'workflow.generated',
			},
		),
	];

	return {
		request: input.request,
		repositoryUrl: input.repositoryUrl,
		awsEnvironmentInfo: input.awsEnvironmentInfo,
		workflow: {
			name: `n7n: ${input.request.slice(0, 80)}`,
			nodes,
			connections: buildConnections(nodes.map((workflowNode) => String(workflowNode.name))),
			settings: {
				executionOrder: 'v1',
			},
		},
		explanation: buildExplanation(input),
		editableGraph: true,
		generator: {
			mode: 'deterministic-mvp',
			provider: 'unbound',
		},
	};
}

function node(name: string, type: string, x: number, y: number, parameters: IDataObject): IDataObject {
	return {
		parameters,
		id: name.toLowerCase().replace(/\s+/g, '-'),
		name,
		type,
		typeVersion: 1,
		position: [x, y],
	};
}

function buildConnections(nodeNames: string[]): IDataObject {
	const connections: IDataObject = {};

	for (let index = 0; index < nodeNames.length - 1; index++) {
		connections[nodeNames[index]] = {
			main: [[{ node: nodeNames[index + 1], type: 'main', index: 0 }]],
		};
	}

	return connections;
}

function validationNodeName(tool: string): string {
	if (tool === 'pytest') return 'pytest Validation';
	if (tool === 'mypy') return 'mypy Validation';

	return 'Ruff Validation';
}

function validationNodeType(tool: string): string {
	if (tool === 'pytest') return 'n8n-nodes-base.n7nPytestValidation';
	if (tool === 'mypy') return 'n8n-nodes-base.n7nMypyValidation';

	return 'n8n-nodes-base.n7nRuffValidation';
}

function validationCommand(tool: string): string {
	if (tool === 'pytest') return 'pytest';
	if (tool === 'mypy') return 'mypy .';

	return 'ruff check .';
}

function buildSystemContext(input: {
	request: string;
	repositoryUrl?: string;
	awsEnvironmentInfo?: string;
}): string {
	const context = [
		'n7n engineering workflow task',
		`Request: ${input.request}`,
		input.repositoryUrl ? `Repository: ${input.repositoryUrl}` : '',
		input.awsEnvironmentInfo ? `AWS: ${input.awsEnvironmentInfo}` : '',
	];

	return splitLines(context.join('\n')).join('\n');
}

function buildExplanation(input: {
	request: string;
	repositoryUrl?: string;
	awsEnvironmentInfo?: string;
	validationTools: string[];
}): string {
	const parts = [
		'The generated workflow starts by creating repository context, then routes the request to a coding-agent task node.',
		input.validationTools.length > 0
			? `It validates the agent output with ${input.validationTools.join(', ')} and keeps repair metadata available for retry loops.`
			: 'It leaves validation empty so the graph can be edited before execution.',
		input.repositoryUrl ? 'Repository URL is included as context for repository-aware execution.' : '',
		input.awsEnvironmentInfo ? 'AWS environment information is included as operational context.' : '',
		'The final node emits OpenTelemetry-oriented trace metadata for observability.',
	];

	return splitLines(parts.join('\n')).join(' ');
}
