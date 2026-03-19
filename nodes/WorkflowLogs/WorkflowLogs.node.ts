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
        displayName: 'Mode',
        name: 'mode',
        type: 'options',
        options: [
          {
            name: 'Auto-Detect (Error Trigger)',
            value: 'autoDetect',
            description: 'Automatically extract error details from Error Trigger output',
          },
          {
            name: 'Manual',
            value: 'manual',
            description: 'Manually configure all fields',
          },
        ],
        default: 'autoDetect',
        description: 'Auto-Detect mode parses the Error Trigger output automatically',
      },
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
        displayOptions: {
          show: {
            mode: ['manual'],
          },
        },
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
            description: 'Override the auto-detected error code (e.g. TIMEOUT, AUTH_FAILED)',
          },
          {
            displayName: 'Severity',
            name: 'severity',
            type: 'options',
            options: [
              { name: 'Critical', value: 'CRITICAL' },
              { name: 'High', value: 'HIGH' },
              { name: 'Medium', value: 'MEDIUM' },
              { name: 'Low', value: 'LOW' },
              { name: 'Info', value: 'INFO' },
            ],
            default: '',
            description: 'Override the auto-detected severity level. Leave empty for auto-detection.',
          },
          {
            displayName: 'Execution URL (Override)',
            name: 'executionUrl',
            type: 'string',
            default: '',
            description: 'Override the auto-generated execution URL. Leave empty to use the auto-detected URL.',
          },
          {
            displayName: 'Workflow ID (Override)',
            name: 'workflowId',
            type: 'string',
            default: '',
            description: 'Override the auto-detected workflow ID. Leave empty to use the current workflow ID.',
          },
          {
            displayName: 'Workflow Name (Override)',
            name: 'workflowName',
            type: 'string',
            default: '',
            description: 'Override the auto-detected workflow name. Leave empty to use the current workflow name.',
          },
          {
            displayName: 'Execution ID (Override)',
            name: 'executionId',
            type: 'string',
            default: '',
            description: 'Override the auto-detected execution ID. Leave empty to use the current execution ID.',
          },
          {
            displayName: 'Node Name (Override)',
            name: 'nodeName',
            type: 'string',
            default: '',
            description: 'Override the auto-detected node name. In Auto-Detect mode, extracted from Error Trigger data.',
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
    const rawBaseUrl = (credentials.baseUrl as string).replace(/\/$/, '');
    const apiKey = credentials.apiKey as string;
    let ingestUrl = '';

    // Validate base URL to prevent SSRF attacks
    try {
      const parsedUrl = new URL(rawBaseUrl);
      if (!['https:', 'http:'].includes(parsedUrl.protocol)) {
        throw new NodeOperationError(this.getNode(), 'Base URL must use HTTP or HTTPS protocol');
      }
      const hostname = parsedUrl.hostname;
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0' ||
        hostname === '::1' ||
        hostname.startsWith('169.254.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('192.168.') ||
        /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
      ) {
        throw new NodeOperationError(
          this.getNode(),
          'Base URL must not point to a private or loopback address',
        );
      }
    } catch (error) {
      if (error instanceof NodeOperationError) throw error;
      throw new NodeOperationError(this.getNode(), 'Invalid Base URL format');
    }

    // Normalize URL so users can provide either:
    // - https://api.workflowlogs.com
    // - https://api.workflowlogs.com/api
    const normalizedBaseUrl = rawBaseUrl.replace(/\/api$/, '');
    ingestUrl = `${normalizedBaseUrl}/api/logs/ingest`;

    // Auto-bind all available metadata from n8n context
    const workflow = this.getWorkflow();
    const executionId = this.getExecutionId();
    const instanceBaseUrl = this.getInstanceBaseUrl().replace(/\/$/, '');
    const executionUrl = `${instanceBaseUrl}/workflow/${workflow.id}/executions/${executionId}`;

    for (let i = 0; i < items.length; i++) {
      try {
        const mode = this.getNodeParameter('mode', i) as string;
        const logType = this.getNodeParameter('logType', i) as string;
        const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

        // Auto-filled from n8n context — no user config needed
        const body: IDataObject = {
          type: logType,
          workflowId: workflow.id?.toString(),
          workflowName: workflow.name,
          executionId,
          executionUrl,
        };

        if (mode === 'autoDetect') {
          // Auto-extract from Error Trigger or any input data
          const json = items[i].json as IDataObject;
          body.message = extractMessage(json, logType);
          body.stackTrace = extractStackTrace(json);
          body.nodeName = extractField(json, ['execution.lastNodeExecuted', 'lastNodeExecuted']) as string || undefined;

          // Always include the full input data in auto-detect mode
          body.payload = json;
        } else {
          // Manual mode
          const message = this.getNodeParameter('message', i) as string;
          body.message = message;

          if (additionalFields.stackTrace) body.stackTrace = additionalFields.stackTrace;
          if (additionalFields.nodeName) body.nodeName = additionalFields.nodeName;
          if (additionalFields.nodeType) body.nodeType = additionalFields.nodeType;

          if (additionalFields.includeInputData) {
            body.payload = items[i].json;
          }
        }

        // Overrides from additionalFields (apply in both modes)
        if (additionalFields.errorCode) body.errorCode = additionalFields.errorCode;
        if (additionalFields.severity) body.severity = additionalFields.severity;
        if (additionalFields.executionUrl) body.executionUrl = additionalFields.executionUrl;
        if (additionalFields.workflowId) body.workflowId = additionalFields.workflowId;
        if (additionalFields.workflowName) body.workflowName = additionalFields.workflowName;
        if (additionalFields.executionId) body.executionId = additionalFields.executionId;

        if (additionalFields.metadata) {
          try {
            const parsed = typeof additionalFields.metadata === 'string'
              ? JSON.parse(additionalFields.metadata)
              : additionalFields.metadata;
            // Prevent prototype pollution
            if (parsed && typeof parsed === 'object') {
              delete parsed.__proto__;
              delete parsed.constructor;
              delete parsed.prototype;
            }
            body.metadata = parsed;
          } catch {
            body.metadata = { raw: additionalFields.metadata };
          }
        }

        const response = await this.helpers.httpRequest({
          method: 'POST',
          url: ingestUrl,
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
          const errMsg = (error as Error).message || 'Unknown error';
          returnData.push({
            json: {
              error: errMsg.substring(0, 200),
              success: false,
            },
            pairedItem: { item: i },
          });
          continue;
        }

        const errorObj = error as {
          message?: string;
          response?: {
            status?: number;
            data?: unknown;
          };
        };
        const status = errorObj.response?.status;
        const responseData = errorObj.response?.data;
        let responseDetails = '';
        if (responseData !== undefined) {
          responseDetails =
            typeof responseData === 'string'
              ? responseData
              : JSON.stringify(responseData);
          if (responseDetails.length > 500) {
            responseDetails = `${responseDetails.slice(0, 500)}...`;
          }
        }

        const descriptionParts = [
          'Failed to send log to WorkflowLogs.',
          status ? `HTTP ${status}.` : '',
          responseDetails ? `API response: ${responseDetails}` : 'Check your API key and base URL.',
        ].filter(Boolean);

        throw new NodeOperationError(this.getNode(), error as Error, {
          itemIndex: i,
          description: descriptionParts.join(' '),
        });
      }
    }

    return [returnData];
  }
}

// ========================================
// Helper functions for auto-detection
// ========================================

/**
 * Extract a value from nested JSON using dot-notation paths
 */
function extractField(json: IDataObject, paths: string[]): unknown {
  for (const path of paths) {
    const parts = path.split('.');
    let current: unknown = json;
    let found = true;
    for (const part of parts) {
      if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[part];
      } else {
        found = false;
        break;
      }
    }
    if (found && current !== undefined && current !== null && current !== '') {
      return current;
    }
  }
  return null;
}

/**
 * Extract error message from various n8n data structures
 */
function extractMessage(json: IDataObject, logType: string): string {
  if (logType === 'SUCCESS') {
    return 'Workflow executed successfully';
  }

  // Try common error paths from Error Trigger
  const paths = [
    'execution.error.message',
    'error.message',
    'message',
    'execution.error',
    'error',
  ];

  for (const path of paths) {
    const value = extractField(json, [path]);
    if (value && typeof value === 'string') {
      return value;
    }
    if (value && typeof value === 'object') {
      return JSON.stringify(value);
    }
  }

  return 'Unknown error';
}

/**
 * Extract stack trace from various n8n data structures
 */
function extractStackTrace(json: IDataObject): string | undefined {
  const paths = [
    'execution.error.stack',
    'error.stack',
    'stack',
    'execution.error.stackTrace',
    'stackTrace',
  ];

  for (const path of paths) {
    const value = extractField(json, [path]);
    if (value && typeof value === 'string') {
      return value;
    }
  }

  return undefined;
}
