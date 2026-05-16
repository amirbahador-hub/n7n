import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { n7nNodeDefaults, nonEmptyString, withN7nPayload } from './shared';

export class N7nRepositoryAnalysis implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'n7n Repository Analysis',
		name: 'n7nRepositoryAnalysis',
		icon: n7nNodeDefaults.icon,
		iconColor: n7nNodeDefaults.iconColor,
		group: n7nNodeDefaults.group,
		version: 1,
		description: 'Prepare repository context requirements for AI-native engineering workflows',
		defaults: {
			name: 'Repository Analysis',
		},
		inputs: n7nNodeDefaults.inputs,
		outputs: n7nNodeDefaults.outputs,
		properties: [
			{
				displayName: 'Repository URL',
				name: 'repositoryUrl',
				type: 'string',
				default: '',
				description: 'Remote repository URL',
			},
			{
				displayName: 'Repository Path',
				name: 'repositoryPath',
				type: 'string',
				default: '',
				description: 'Local repository path when available to the executor',
			},
			{
				displayName: 'Include Dependency Graph',
				name: 'includeDependencyGraph',
				type: 'boolean',
				default: true,
			},
			{
				displayName: 'Include Architecture Summary',
				name: 'includeArchitectureSummary',
				type: 'boolean',
				default: true,
			},
			{
				displayName: 'Relevant File Hints',
				name: 'relevantFileHints',
				type: 'string',
				typeOptions: { rows: 3 },
				default: '',
				description: 'Optional paths, globs, or concepts to prioritize during context selection',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData = items.map((item, itemIndex) => {
			const repositoryUrl = nonEmptyString(this.getNodeParameter('repositoryUrl', itemIndex));
			const repositoryPath = nonEmptyString(this.getNodeParameter('repositoryPath', itemIndex));
			const includeDependencyGraph = Boolean(
				this.getNodeParameter('includeDependencyGraph', itemIndex),
			);
			const includeArchitectureSummary = Boolean(
				this.getNodeParameter('includeArchitectureSummary', itemIndex),
			);
			const relevantFileHints = nonEmptyString(
				this.getNodeParameter('relevantFileHints', itemIndex),
			);

			return withN7nPayload(item, 'repositoryAnalysis', {
				repositoryUrl,
				repositoryPath,
				includeDependencyGraph,
				includeArchitectureSummary,
				relevantFileHints,
				status: 'pending',
				contextOutputs: [
					'frameworkDetection',
					'dependencyGraph',
					'architectureSummary',
					'relevantFiles',
					'contextPack',
				],
			});
		});

		return [returnData];
	}
}
