import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
  NodeOperationError,
} from 'n8n-workflow';

export class WorkflowLogs implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'WorkflowLogs',
    name: 'workflowLogs',
    icon: 'file:workflowlogs.svg',
    group: ['output'],
    version: 1,
    subtitle: '={{$parameter["logType"]}} log',
    description: 'Send workflow logs to WorkflowLogs monitoring platform',
    defaults: {
      name: 'WorkflowLogs',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'workflowLogsApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Log Type',
        name: 'logType',
        type: 'options',
        options: [
          {
            name: 'Error',
            value: 'ERROR',
            description: 'Log an error event',
          },
          {
            name: 'Success',
            value: 'SUCCESS',
            description: 'Log a success event',
          },
        ],
        default: 'ERROR',
        required: true,
        description: 'The type of log to send',
      },
      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        required: true,
        description: 'The log message. Supports expressions, e.g. {{$json.error.message}}.',
        typeOptions: {
          rows: 3,
        },
      },
      {
        displayName: 'Additional Fields',
        name: 'additionalFields',
        type: 'collection',
        placeholder: 'Add Field',
        default: {},
        options: [
          {
            displayName: 'Error Code',
            name: 'errorCode',
            type: 'string',
            default: '',
            description: 'An error code to categorize errors (e.g. TIMEOUT, AUTH_FAILED, RATE_LIMIT)',
          },
          {
            displayName: 'Workflow ID',
            name: 'workflowId',
            type: 'string',
            default: '={{$workflow.id}}',
            description: 'The n8n workflow ID (auto-filled)',
          },
          {
            displayName: 'Workflow Name',
            name: 'workflowName',
            type: 'string',
            default: '={{$workflow.name}}',
            description: 'The n8n workflow name (auto-filled)',
          },
          {
            displayName: 'Execution ID',
            name: 'executionId',
            type: 'string',
            default: '={{$execution.id}}',
            description: 'The n8n execution ID (auto-filled)',
          },
          {
            displayName: 'Node Name',
            name: 'nodeName',
            type: 'string',
            default: '',
            description: 'The name of the node that triggered this log',
          },
          {
            displayName: 'Node Type',
            name: 'nodeType',
            type: 'string',
            default: '',
            description: 'The type of the node that triggered this log',
          },
          {
            displayName: 'Stack Trace',
            name: 'stackTrace',
            type: 'string',
            default: '',
            description: 'Full stack trace for errors',
            typeOptions: {
              rows: 5,
            },
          },
          {
            displayName: 'Include Input Data',
            name: 'includeInputData',
            type: 'boolean',
            default: false,
            description: 'Whether to include the input item data as payload in the log',
          },
          {
            displayName: 'Custom Metadata',
            name: 'metadata',
            type: 'json',
            default: '{}',
            description: 'Custom JSON metadata to attach to the log',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const credentials = await this.getCredentials('workflowLogsApi');
    const baseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
    const apiKey = credentials.apiKey as string;

    for (let i = 0; i < items.length; i++) {
      try {
        const logType = this.getNodeParameter('logType', i) as string;
        const message = this.getNodeParameter('message', i) as string;
        const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

        const body: IDataObject = {
          type: logType,
          message,
        };

        if (additionalFields.errorCode) body.errorCode = additionalFields.errorCode;
        if (additionalFields.workflowId) body.workflowId = additionalFields.workflowId;
        if (additionalFields.workflowName) body.workflowName = additionalFields.workflowName;
        if (additionalFields.executionId) body.executionId = additionalFields.executionId;
        if (additionalFields.nodeName) body.nodeName = additionalFields.nodeName;
        if (additionalFields.nodeType) body.nodeType = additionalFields.nodeType;
        if (additionalFields.stackTrace) body.stackTrace = additionalFields.stackTrace;

        if (additionalFields.includeInputData) {
          body.payload = items[i].json;
        }

        if (additionalFields.metadata) {
          try {
            body.metadata = typeof additionalFields.metadata === 'string'
              ? JSON.parse(additionalFields.metadata)
              : additionalFields.metadata;
          } catch {
            body.metadata = { raw: additionalFields.metadata };
          }
        }

        const response = await this.helpers.httpRequest({
          method: 'POST',
          url: `${baseUrl}/api/logs/ingest`,
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey,
          },
          body,
          json: true,
        });

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(response as IDataObject),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);

      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: (error as Error).message,
              success: false,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw new NodeOperationError(this.getNode(), error as Error, {
          itemIndex: i,
          description: 'Failed to send log to WorkflowLogs. Check your API key and base URL.',
        });
      }
    }

    return [returnData];
  }
}
