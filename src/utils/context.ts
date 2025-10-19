import { ZeaburContext, GraphQLClient } from "../types/index.js";
import { createGraphQLClient } from "../index.js";
import { createDemoContext } from "./demo.js";

/**
 * Create a Zeabur context with authentication
 * @param token - Zeabur API token (required - must be provided by your application)
 * @param endpoint - GraphQL endpoint (optional, defaults to 'https://api.zeabur.com/graphql')
 * @throws Error if token is not provided
 */
export function createZeaburContext(
  token: string,
  endpoint?: string
): ZeaburContext {
  return {
    graphql: createGraphQLClient(token, endpoint)
  };
}

/**
 * Create a context from existing GraphQL client
 * @param graphqlClient - Pre-configured GraphQL client
 */
export function createZeaburContextFromClient(
  graphqlClient: GraphQLClient
): ZeaburContext {
  return {
    graphql: graphqlClient
  };
}

/**
 * Create a demo context for testing without API tokens
 */
export function createZeaburDemoContext(): ZeaburContext {
  return createDemoContext();
}

/**
 * Validate that a context has the required GraphQL client
 */
export function validateContext(context: ZeaburContext): void {
  if (!context.graphql) {
    throw new Error('ZeaburContext must have a GraphQL client');
  }
}