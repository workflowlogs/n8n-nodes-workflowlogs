import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class N8nLogsApi implements ICredentialType {
  name = 'n8nLogsApi';
  displayName = 'n8nLogs API';
  documentationUrl = 'https://n8nlogs.com/docs';

  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description: 'Your n8nLogs project API key. Find it in your project settings at n8nlogs.com.',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.n8nlogs.com',
      description: 'The n8nLogs API base URL. Change this only if you self-host n8nLogs.',
    },
  ];
}
