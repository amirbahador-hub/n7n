import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { n7nNodeDefaults } from './shared';
import { buildValidationItems, validationProperties } from './N7nRuffValidation.node';

export class N7nPytestValidation implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'n7n pytest Validation',
		name: 'n7nPytestValidation',
		icon: n7nNodeDefaults.icon,
		iconColor: n7nNodeDefaults.iconColor,
		group: n7nNodeDefaults.group,
		version: 1,
		description: 'Represent a pytest validation step with repair-loop metadata',
		defaults: {
			name: 'pytest Validation',
		},
		inputs: n7nNodeDefaults.inputs,
		outputs: n7nNodeDefaults.outputs,
		properties: validationProperties('pytest'),
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		return [await buildValidationItems(this, 'pytestValidation', 'pytest')];
	}
}
