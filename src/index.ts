// Export core tools
export * from "./core/index.js";

// Export types
export * from "./types/index.js";

// Export utilities
export * from "./utils/context.js";

import { GraphQLClient } from "./types/index.js";

// Helper function to create GraphQL client
export function createGraphQLClient(token: string, endpoint = 'https://api.zeabur.com/graphql'): GraphQLClient {
  return {
    async query<T = any>(query: string, variables?: Record<string, any>): Promise<{ data: T; errors?: any[] }> {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result = await response.json() as { data: T; errors?: any[] };

      if (!response.ok) {
        const errorMsg = result.errors ? JSON.stringify(result.errors) : `HTTP error! status: ${response.status}`;
        throw new Error(errorMsg);
      }

      return result;
    },

    async getUserInfo() {
      const query = `
        query GetUserInfo {
          me {
            _id
            email
          }
        }
      `;
      return this.query(query);
    }
  };
}