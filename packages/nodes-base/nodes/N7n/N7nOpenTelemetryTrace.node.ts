import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { n7nNodeDefaults, nonEmptyString, withN7nPayload } from './shared';

export class N7nOpenTelemetryTrace implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'n7n OpenTelemetry Trace',
		name: 'n7nOpenTelemetryTrace',
		icon: n7nNodeDefaults.icon,
		iconColor: n7nNodeDefaults.iconColor,
		group: n7nNodeDefaults.group,
		version: 1,
		description: 'Attach OpenTelemetry-oriented execution metadata to an engineering workflow',
		defaults: {
			name: 'OpenTelemetry Trace',
		},
		inputs: n7nNodeDefaults.inputs,
		outputs: n7nNodeDefaults.outputs,
		properties: [
			{ displayName: 'Span Name', name: 'spanName', type: 'string', default: 'n7n.workflow.step' },
			{ displayName: 'Event Name', name: 'eventName', type: 'string', default: 'n7n.event' },
			{
				displayName: 'Trace Attributes',
				name: 'traceAttributes',
				type: 'json',
				default: '{}',
				description: 'Additional attributes to attach to the trace event',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const returnData = this.getInputData().map((item, itemIndex) => {
			const spanName = String(this.getNodeParameter('spanName', itemIndex));
			const eventName = String(this.getNodeParameter('eventName', itemIndex));
			const traceAttributes = nonEmptyString(this.getNodeParameter('traceAttributes', itemIndex));

			return withN7nPayload(item, 'openTelemetryTrace', {
				spanName,
				eventName,
				traceAttributes: traceAttributes ?? '{}',
				metrics: {
					tokenUsage: 'pending',
					latencyMs: 'pending',
					retryCount: 'pending',
					nodeExecutionGraph: 'pending',
					failureSpans: 'pending',
				},
				exporter: {
					type: 'opentelemetry',
					status: 'adapter-required',
				},
			});
		});

		return [returnData];
	}
}
