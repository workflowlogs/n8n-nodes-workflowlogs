# n8n-nodes-workflowlogs

n8n community node for sending workflow logs (success/error) to the [WorkflowLogs](https://workflowlogs.com) monitoring platform.

![n8n](https://img.shields.io/badge/n8n-community--node-ff6d5a)
![npm](https://img.shields.io/npm/v/n8n-nodes-workflowlogs)
![license](https://img.shields.io/npm/l/n8n-nodes-workflowlogs)

## Installation

### In n8n Desktop / Self-hosted

1. Open **Settings** > **Community Nodes**
2. Enter `n8n-nodes-workflowlogs`
3. Click **Install**

### Via npm (for custom n8n setups)

```bash
cd ~/.n8n
npm install n8n-nodes-workflowlogs
```

Then restart n8n.

## Setup

1. Sign up at [workflowlogs.com](https://workflowlogs.com) (or your self-hosted instance)
2. Create a project and copy your **API Key**
3. In n8n, go to **Credentials** > **New** > **WorkflowLogs API**
4. Paste your API key and set the Base URL (default: `https://api.workflowlogs.com`)

## Node: WorkflowLogs

The **WorkflowLogs** node sends log entries to your WorkflowLogs dashboard.

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| **Log Type** | `ERROR` / `SUCCESS` | The type of log event |
| **Message** | string | The log message (supports n8n expressions) |

### Additional Fields

| Field | Type | Description |
|-------|------|-------------|
| Error Code | string | Categorize errors (e.g. `TIMEOUT`, `AUTH_FAILED`) |
| Workflow ID | string | Auto-filled with `{{$workflow.id}}` |
| Workflow Name | string | Auto-filled with `{{$workflow.name}}` |
| Execution ID | string | Auto-filled with `{{$execution.id}}` |
| Node Name | string | Name of the node that triggered the log |
| Node Type | string | Type of the node that triggered the log |
| Stack Trace | string | Full stack trace for errors |
| Include Input Data | boolean | Attach the input item data as payload |
| Custom Metadata | JSON | Custom JSON metadata to attach |

## Usage Examples

### Error Monitoring

Connect the **Error Trigger** node to **WorkflowLogs** with Log Type set to `ERROR`:

```
[Error Trigger] → [WorkflowLogs (ERROR)]
```

The node automatically captures the error message, workflow details, and execution ID.

### Success Logging

Add **WorkflowLogs** at the end of your workflow with Log Type set to `SUCCESS`:

```
[Your Workflow] → [WorkflowLogs (SUCCESS)]
```

### Error + Slack Notification

Combine error logging with team notifications:

```
[Error Trigger] → [WorkflowLogs (ERROR)]
                → [Slack]
```

## Templates

Ready-to-import workflow templates are available in the [`templates/`](./templates/) directory:

- **basic-error-monitoring.json** — Error Trigger → WorkflowLogs
- **success-logging.json** — HTTP Trigger → Process → WorkflowLogs (SUCCESS)
- **error-with-slack-notification.json** — Error Trigger → WorkflowLogs + Slack

Import them in n8n via **Workflows** > **Import from File**.

## Self-Hosting

If you self-host WorkflowLogs, change the **Base URL** in the credential settings to point to your instance:

```
https://your-workflowlogs-instance.com
```

## Development

```bash
# Clone the repo
git clone https://github.com/josephjoberno/n8n-nodes-workflowlogs.git
cd n8n-nodes-workflowlogs

# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

### Publishing

Releases are automated via GitHub Actions. Every push to `main` triggers a patch release. Use the workflow dispatch for minor/major bumps.

## License

[MIT](./LICENSE.md)
