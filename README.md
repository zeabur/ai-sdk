# Zeabur AI SDK

The Zeabur AI SDK is a TypeScript toolkit designed to help you build AI-powered deployment agents and automation tools using popular frameworks like Next.js, React, and Node.js.

## Installation

You will need Node.js 18+ and npm (or another package manager) installed on your local development machine.

```bash
npm install @zeabur/ai-sdk
```

## Usage

### Executing Commands

```typescript
import { zeaburTools, createZeaburContext } from '@zeabur/ai-sdk';

const context = createZeaburContext('your-api-token');

const result = await zeaburTools.executeCommand({
  serviceId: 'service-123',
  environmentId: 'env-456',
  command: ['ls', '-la']
}, context);
```

### Deploying from Specifications

```typescript
import { zeaburTools, createZeaburContext } from '@zeabur/ai-sdk';

const context = createZeaburContext('your-api-token');

const result = await zeaburTools.deployFromSpecification({
  projectID: 'project-123',
  specification: {
    services: [
      {
        name: 'web',
        template: 'NODEJS',
        // ... service configuration
      }
    ]
  }
}, context);
```

### Monitoring and Logs

```typescript
import { zeaburTools } from '@zeabur/ai-sdk';

// Get build logs
const buildLogs = await zeaburTools.getBuildLogs({
  projectID: 'project-123',
  deploymentID: 'deploy-456'
}, context);

// Get runtime logs
const runtimeLogs = await zeaburTools.getRuntimeLogs({
  serviceID: 'service-123',
  environmentID: 'env-456',
  type: 'BUILD'
}, context);

// Get deployment history
const deployments = await zeaburTools.getDeployments({
  serviceId: 'service-123'
}, context);
```

### Working with Templates

```typescript
import { zeaburTools } from '@zeabur/ai-sdk';

const templates = await zeaburTools.searchTemplate({
  query: 'nextjs'
}, context);
```

## AI SDK Integration

The Zeabur AI SDK works seamlessly with the Vercel AI SDK to build intelligent deployment agents.

### Agent Example

```typescript
import { ToolLoopAgent } from 'ai';
import { zeaburTools, createZeaburContext } from '@zeabur/ai-sdk';
import { openai } from '@ai-sdk/openai';

const zeaburContext = createZeaburContext(process.env.ZEABUR_API_TOKEN);

const deploymentAgent = new ToolLoopAgent({
  model: openai('gpt-4o'),
  system: 'You are a Zeabur deployment assistant.',
  tools: {
    execute_command: {
      description: 'Execute commands on Zeabur services',
      inputSchema: zeaburSchemas.executeCommandSchema,
      execute: async (input) => {
        return await zeaburTools.executeCommand(input, zeaburContext);
      }
    },
    deploy_service: {
      description: 'Deploy services on Zeabur',
      inputSchema: zeaburSchemas.deployFromSpecificationSchema,
      execute: async (input) => {
        return await zeaburTools.deployFromSpecification(input, zeaburContext);
      }
    }
  }
});
```

### Next.js API Route

```typescript
// app/api/chat/route.ts
import { createZeaburContext, zeaburTools } from '@zeabur/ai-sdk';
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const zeaburContext = createZeaburContext(
    process.env.ZEABUR_API_TOKEN
  );

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    tools: {
      execute_command: {
        description: 'Execute commands on services',
        parameters: zeaburSchemas.executeCommandSchema,
        execute: async (args) => {
          return await zeaburTools.executeCommand(args, zeaburContext);
        }
      }
    }
  });

  return result.toDataStreamResponse();
}
```

## Demo Mode

Try the SDK without authentication - perfect for testing and learning:

```typescript
import { zeaburTools, createZeaburDemoContext } from '@zeabur/ai-sdk';

// No API token required - returns mock data
const demoContext = createZeaburDemoContext();

const result = await zeaburTools.executeCommand({
  serviceId: 'demo-service',
  environmentId: 'demo-env',
  command: ['ls', '-la']
}, demoContext);

console.log(result); // Returns: "Mock command output: Hello from demo mode!"
```

## Available Tools

### Core Operations
- **executeCommand** - Execute shell commands on services
- **deployFromSpecification** - Deploy services from YAML/JSON specifications
- **executeGraphQL** - Run custom GraphQL queries

### File System
- **decideFilesystem** - Determine GitHub or Upload ID
- **listFiles** - List directory contents
- **readFile** - Read file with pagination support
- **fileDirRead** - Execute safe read-only commands

### Monitoring
- **getBuildLogs** - Fetch build logs for deployments
- **getRuntimeLogs** - Get service runtime logs
- **getDeployments** - List deployment history

### Templates
- **searchTemplate** - Search deployment templates

### UI Components
- **renderRegionSelector** - Region selection interface
- **renderProjectSelector** - Project selection interface
- **renderServiceCard** - Service status cards
- **renderDockerfile** - Syntax-highlighted Dockerfile viewer
- **renderRecommendation** - Smart recommendation buttons
- **renderFloatingButton** - Floating action buttons

## Authentication

The SDK requires a Zeabur API token to be explicitly passed by your application:

```typescript
// ✅ Correct - Your application manages the token
const token = process.env.ZEABUR_API_TOKEN;
const context = createZeaburContext(token);

// Or from cookies, headers, database, etc.
const token = cookies().get('token')?.value;
const context = createZeaburContext(token);
```

**Note:** This SDK is a library and does NOT read environment variables directly. The consuming application is responsible for managing authentication.

## Development

```bash
npm install          # Install dependencies
npm run build        # Build TypeScript
npm run demo         # Run demo mode
npm run type-check   # Type checking
npm run lint         # Linting
```

## Community

Join the Zeabur community to ask questions, share ideas, and get help:

- [Discord](https://discord.gg/zeabur)
- [GitHub Discussions](https://github.com/zeabur/zeabur/discussions)
- [Documentation](https://zeabur.com/docs)

## Contributing

Contributions to the Zeabur AI SDK are welcome and highly appreciated. Please check out our contributing guidelines before getting started.

## Authors

This library is created by the Zeabur team, with contributions from the Open Source Community.

## License

MIT
