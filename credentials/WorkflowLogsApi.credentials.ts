import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class WorkflowLogsApi implements ICredentialType {
  name = 'workflowLogsApi';
  displayName = 'WorkflowLogs API';
  documentationUrl = 'https://workflowlogs.com/docs';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your WorkflowLogs project API key. Find it in your project settings at workflowlogs.com.',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.workflowlogs.com',
      description: 'The WorkflowLogs API base URL. Change this only if you self-host WorkflowLogs.',
    },
  ];
}
