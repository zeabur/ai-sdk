// Demo/Mock functionality for developers to try the SDK

import { ZeaburContext, GraphQLClient } from "../types/index.js";

/**
 * Create a demo GraphQL client that returns mock data
 * Useful for testing and development without real API tokens
 */
export function createDemoGraphQLClient(): GraphQLClient {
  return {
    async query<T = any>(query: string, variables?: Record<string, any>): Promise<{ data: T; errors?: any[] }> {
      console.log('🎭 Demo mode: Mock GraphQL query executed');
      console.log('Query:', query.substring(0, 100) + '...');
      console.log('Variables:', variables);
      
      // Return mock data based on query type
      if (query.includes('executeCommand')) {
        return {
          data: {
            executeCommand: {
              exitCode: 0,
              output: 'Mock command output: Hello from demo mode!'
            }
          } as T
        };
      }
      
      if (query.includes('buildLogs')) {
        return {
          data: {
            buildLogs: [
              { timestamp: new Date().toISOString(), message: 'Starting build...', level: 'info' },
              { timestamp: new Date().toISOString(), message: 'Build completed successfully', level: 'info' }
            ]
          } as T
        };
      }
      
      if (query.includes('runtimeLogs')) {
        return {
          data: {
            runtimeLogs: [
              { timestamp: new Date().toISOString(), message: 'Server started on port 3000', level: 'info' },
              { timestamp: new Date().toISOString(), message: 'Handling request GET /', level: 'debug' }
            ]
          } as T
        };
      }
      
      if (query.includes('deployments')) {
        return {
          data: {
            service: {
              deployments: [
                { _id: 'demo-deploy-1', status: 'RUNNING', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:05:00Z' },
                { _id: 'demo-deploy-2', status: 'SUCCEEDED', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:05:00Z' }
              ]
            }
          } as T
        };
      }
      
      if (query.includes('templates')) {
        return {
          data: {
            templates: [
              { _id: 'demo-template-1', name: 'Next.js Starter', description: 'A demo Next.js template', category: 'frontend', tags: ['react', 'nextjs'] },
              { _id: 'demo-template-2', name: 'Express API', description: 'A demo Express.js API', category: 'backend', tags: ['nodejs', 'express'] }
            ]
          } as T
        };
      }
      
      if (query.includes('files')) {
        return {
          data: {
            files: ['package.json', 'src/', 'README.md', 'tsconfig.json']
          } as T
        };
      }
      
      if (query.includes('fileContent')) {
        return {
          data: {
            fileContent: '{\n  "name": "demo-project",\n  "version": "1.0.0",\n  "main": "index.js"\n}'
          } as T
        };
      }
      
      // Default mock response
      return {
        data: {
          message: 'Mock response from demo mode'
        } as T
      };
    },

    async getUserInfo() {
      return {
        data: {
          me: {
            _id: 'demo-user-123',
            email: 'demo@zeabur.com'
          }
        }
      };
    }
  };
}

/**
 * Create a demo Zeabur context for testing
 */
export function createDemoContext(): ZeaburContext {
  return {
    graphql: createDemoGraphQLClient()
  };
}

/**
 * Check if we're in demo mode
 */
export function isDemoMode(context: ZeaburContext): boolean {
  // Simple check - in real implementation you might want a more robust check
  return context.graphql.query.toString().includes('Mock GraphQL query executed');
}