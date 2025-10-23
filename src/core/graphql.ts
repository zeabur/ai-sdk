import { z } from "zod";
import { ZeaburContext } from "../types/index.js";

export const executeGraphqlSchema = z.object({
  query: z.string(),
  variables: z.record(z.string(), z.any()).optional(),
});

export type ExecuteGraphqlInput = z.infer<typeof executeGraphqlSchema>;

export async function executeGraphql(
  args: ExecuteGraphqlInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(args.query, args.variables);
  
  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}