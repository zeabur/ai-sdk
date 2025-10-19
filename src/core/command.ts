import { z } from "zod";
import { ZeaburContext, ExecuteCommandResult } from "../types/index.js";

const MAX_COMMAND_RESPONSE_LENGTH = 2048;

export const executeCommandSchema = z.object({
  serviceId: z.string(),
  environmentId: z.string(),
  command: z.array(z.string())
});

export type ExecuteCommandInput = z.infer<typeof executeCommandSchema>;

export async function executeCommand(
  args: ExecuteCommandInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    mutation ExecuteCommand($serviceId: ObjectID!, $environmentId: ObjectID!, $command: [String!]!) {
      executeCommand(serviceID: $serviceId, environmentID: $environmentId, command: $command) {
        exitCode
        output
      }
    }
  `;

  const variables = {
    serviceId: args.serviceId,
    environmentId: args.environmentId,
    command: args.command
  };

  const response = await context.graphql.query<{ executeCommand: ExecuteCommandResult }>(query, variables);

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  const output = response.data.executeCommand.output ?? "";
  let truncatedResponse = output.slice(0, MAX_COMMAND_RESPONSE_LENGTH)
    + (output.length > MAX_COMMAND_RESPONSE_LENGTH ? '... (truncated)' : '');

  if (response.data.executeCommand.exitCode !== 0) {
    truncatedResponse = `(exit code ${response.data.executeCommand.exitCode}) ` + truncatedResponse;
  }

  return truncatedResponse;
}