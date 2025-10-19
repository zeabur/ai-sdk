# @zeabur/ai-sdk

Zeabur SDK for AI agents and applications. Provides unified access to all Zeabur operations for building intelligent deployment tools.

## 🏗️ Architecture

This SDK provides **pure tool functions** that are framework-agnostic and can be used directly in your applications:

```
@zeabur/ai-sdk/
├── src/
│   ├── core/           # 📦 Pure tool functions (framework-agnostic)
│   ├── types/          # 📝 Shared TypeScript types
│   └── examples/       # 📖 Usage examples
```

## 🚀 Three Ways to Use

### 1. 🎭 Demo Mode (Try without API token)

Perfect for testing and learning:

```typescript
import { zeaburTools, createZeaburDemoContext } from '@zeabur/ai-sdk';

// No API token required - returns mock data
const demoContext = createZeaburDemoContext();

const result = await zeaburTools.executeCommand({
  serviceId: 'demo-service',
  environmentId: 'demo-env',
  command: ['ls', '-la']
}, demoContext);
// Returns: "Mock command output: Hello from demo mode!"
```

### 2. 📦 Direct Tool Usage (Production agents)

Use tools directly in your Zeabur agent:

```typescript
import { zeaburTools, createGraphQLClient } from '@zeabur/ai-sdk';

const context = {
  graphql: createGraphQLClient('your-token')
};

// Use any tool directly
const result = await zeaburTools.executeCommand({
  serviceId: 'service-123',
  environmentId: 'env-456', 
  command: ['ls', '-la']
}, context);

const deployments = await zeaburTools.getDeployments({
  serviceId: 'service-123'
}, context);

const ui = await zeaburTools.renderServiceCard({
  projectID: 'project-123',
  serviceID: 'service-456'
});
```

### 3. 🤖 AI SDK Integration

Wrap tools for Vercel AI SDK (perfect for migrating existing agent):

```typescript
import { tool } from 'ai';
import { zeaburTools, zeaburSchemas } from '@zeabur/ai-sdk';

const executeCommandTool = tool({
  name: 'execute_command',
  description: 'Execute commands on services',
  inputSchema: zeaburSchemas.executeCommandSchema,
  async execute(input) {
    return await zeaburTools.executeCommand(input, context);
  }
});

// Use in streamText, generateText, etc.
```


## 🛠️ Available Tools

### Core Operations
- **execute_command** - Execute commands on services
- **deploy_from_specification** - Deploy from specs
- **execute_graphql** - Run GraphQL queries

### File System
- **decide_filesystem** - Choose GitHub/Upload ID
- **list_files** - List directory contents
- **read_file** - Read file with pagination
- **file_dir_read** - Safe read-only commands

### Monitoring  
- **get_build_logs** - Build deployment logs
- **get_runtime_logs** - Service runtime logs
- **get_deployments** - Deployment history

### Templates
- **search_template** - Find deployment templates

### UI Components
- **render_region_selector** - Region selection UI
- **render_project_selector** - Project selection UI  
- **render_service_card** - Service status cards
- **render_dockerfile** - Syntax-highlighted Dockerfile
- **render_recommendation** - Recommendation buttons
- **render_floating_button** - Floating action buttons

## 📦 Installation

```bash
npm install @zeabur/ai-sdk
```

## 🔧 Migration from Existing Agent

**Before** (separate tool implementations):
```typescript
// zeabur.com/app/api/v2/chat/route.ts
import { executeCommandTool } from './command';
import { deployFromSpecificationTool } from './deploy';
// ... duplicate tool logic
```

**After** (shared SDK):
```typescript
// zeabur.com/app/api/v2/chat/route.ts  
import { createZeaburContext, zeaburTools } from '@zeabur/ai-sdk';

// Simple migration - pass existing token
const context = createZeaburContext(token || process.env.DEV_ZEABUR_API_TOKEN);

// Direct usage with unified SDK
const result = await zeaburTools.executeCommand(args, context);
```

## 🔐 Authentication

**This SDK is a library and does NOT read environment variables directly.** The consuming application (your agent/API route) is responsible for managing authentication.

### Token Management

The SDK requires a Zeabur API token to be **explicitly passed** by your application:

```typescript
// ❌ Wrong - SDK doesn't read env vars internally
const context = createZeaburContext();

// ✅ Correct - Your application reads env vars and passes the token
const token = process.env.ZEABUR_API_TOKEN;
const context = createZeaburContext(token);
```

### Example: Next.js API Route

```typescript
// app/api/chat/route.ts
import { createZeaburContext, zeaburTools } from '@zeabur/ai-sdk';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  
  // Your application handles env var fallback
  const zeaburToken = token || process.env.DEV_ZEABUR_API_TOKEN;
  
  if (!zeaburToken) {
    return new Response('Authentication required', { status: 401 });
  }
  
  // Pass the token explicitly to SDK
  const context = createZeaburContext(zeaburToken);
  
  // Use tools with context
  const result = await zeaburTools.executeCommand(args, context);
}
```

### AI Model Keys (Also handled by your application)

```typescript
// Your application manages all API keys
const bedrock = createAmazonBedrock({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,      // ✅ Your app's responsibility
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // ✅ Your app's responsibility
});

const context = createZeaburContext(
  process.env.ZEABUR_API_TOKEN  // ✅ Your app's responsibility
);
```

### Why This Design?

1. **Library Best Practice** - Libraries shouldn't access `process.env` directly
2. **Flexibility** - You control how/where tokens come from (cookies, headers, DB, etc.)
3. **Security** - You can implement your own token validation logic
4. **Testing** - Easier to test by passing mock tokens

## 🎯 Benefits

1. **📚 Unified Codebase** - Single source of truth for all tools
2. **🔄 No Code Duplication** - Shared logic across applications
3. **⚡ Direct Usage** - Lightweight and fast tool execution  
4. **🛡️ Type Safe** - Full TypeScript support
5. **📖 Easy Migration** - Drop-in replacement for existing tools
6. **🎭 Demo Mode** - Test without authentication

## 🚀 Development

```bash
npm install          # Install dependencies
npm run build        # Build TypeScript
npm run demo         # Run demo mode
npm run type-check   # Type checking
npm run lint         # Linting
```

## 🎯 Getting Started

### Quick Try (No Setup Required)
```bash
git clone https://github.com/zeabur/ai-sdk
cd ai-sdk
npm install
npm run demo  # Try demo mode instantly
```

### Production Setup
1. 📝 Sign up at [zeabur.com](https://zeabur.com)
2. 🔑 Get your API token from dashboard
3. 🚀 Start building!

## 📁 Examples

Check the `examples/` directory for:
- `demo-usage.ts` - Try without API token
- `direct-usage.ts` - Direct tool usage
- `ai-sdk-integration.ts` - AI SDK wrapper  
- `zeabur-agent-migration.ts` - Migration guide

## 📄 License

MIT