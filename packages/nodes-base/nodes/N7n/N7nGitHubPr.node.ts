import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { n7nNodeDefaults, nonEmptyString, withN7nPayload } from './shared';

export class N7nGitHubPr implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'n7n GitHub PR',
		name: 'n7nGitHubPr',
		icon: n7nNodeDefaults.icon,
		iconColor: n7nNodeDefaults.iconColor,
		group: n7nNodeDefaults.group,
		version: 1,
		description: 'Prepare GitHub pull request context and approval-aware PR actions',
		defaults: {
			name: 'GitHub PR',
		},
		inputs: n7nNodeDefaults.inputs,
		outputs: n7nNodeDefaults.outputs,
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{ name: 'Analyze PR', value: 'analyze' },
					{ name: 'Create Review Comment', value: 'createReviewComment' },
					{ name: 'Request Human Approval', value: 'requestApproval' },
				],
				default: 'analyze',
			},
			{ displayName: 'Repository', name: 'repository', type: 'string', default: '' },
			{ displayName: 'Pull Request Number', name: 'pullRequestNumber', type: 'number', default: 0 },
			{
				displayName: 'Require Approval',
				name: 'requireApproval',
				type: 'boolean',
				default: true,
				description: 'Require explicit approval before write operations',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData = this.getInputData().map((item, itemIndex) => {
			const operation = String(this.getNodeParameter('operation', itemIndex));
			const repository = nonEmptyString(this.getNodeParameter('repository', itemIndex));
			const pullRequestNumber = Number(this.getNodeParameter('pullRequestNumber', itemIndex));
			const requireApproval = Boolean(this.getNodeParameter('requireApproval', itemIndex));

			return withN7nPayload(item, 'githubPr', {
				operation,
				repository,
				pullRequestNumber,
				requireApproval,
				status: 'pending',
				contextOutputs: ['changedFiles', 'diffSummary', 'reviewThreads', 'checks'],
			});
		});

		return [returnData];
	}
}
