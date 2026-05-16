import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { n7nNodeDefaults } from './shared';
import { buildValidationItems, validationProperties } from './N7nRuffValidation.node';

export class N7nMypyValidation implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'n7n mypy Validation',
		name: 'n7nMypyValidation',
		icon: n7nNodeDefaults.icon,
		iconColor: n7nNodeDefaults.iconColor,
		group: n7nNodeDefaults.group,
		version: 1,
		description: 'Represent a mypy validation step with repair-loop metadata',
		defaults: {
			name: 'mypy Validation',
		},
		inputs: n7nNodeDefaults.inputs,
		outputs: n7nNodeDefaults.outputs,
		properties: validationProperties('mypy .'),
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return [await buildValidationItems(this, 'mypyValidation', 'mypy')];
	}
}
