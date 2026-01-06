import { z } from "zod/v4";
import { ZeaburContext } from "../types/index.js";

// GraphQL Mutations
const CREATE_ENVIRONMENT_VARIABLE_MUTATION = `
mutation CreateEnvironmentVariable($serviceID: ObjectID!, $environmentID: ObjectID!, $key: String!, $value: String!) {
  createEnvironmentVariable(serviceID: $serviceID, environmentID: $environmentID, key: $key, value: $value) {
    key
    value
    exposed
    readonly
  }
}
`;

const UPDATE_ENVIRONMENT_VARIABLE_MUTATION = `
mutation UpdateSingleEnvironmentVariable($serviceID: ObjectID!, $environmentID: ObjectID!, $oldKey: String!, $newKey: String!, $value: String!) {
  updateSingleEnvironmentVariable(serviceID: $serviceID, environmentID: $environmentID, oldKey: $oldKey, newKey: $newKey, value: $value) {
    key
    value
    exposed
    readonly
  }
}
`;

const DELETE_ENVIRONMENT_VARIABLE_MUTATION = `
mutation DeleteSingleEnvironmentVariable($serviceID: ObjectID!, $environmentID: ObjectID!, $key: String!) {
  deleteSingleEnvironmentVariable(serviceID: $serviceID, environmentID: $environmentID, key: $key) {
    key
    value
    exposed
    readonly
  }
}
`;

// GraphQL Query
const GET_SERVICE_VARIABLES_QUERY = `
query ServiceVariables($serviceID: ObjectID!, $environmentID: ObjectID!) {
  service(_id: $serviceID) {
    _id
    variables(environmentID: $environmentID) {
      key
      value
    }
  }
}
`;

// Create Environment Variable
export const createEnvironmentVariableSchema = z.object({
  serviceId: z.string().describe("ID of the service to create the environment variable for. Get this from listServices."),
  environmentId: z.string().describe("ID of the environment. Get this from listServices under project.environments."),
  key: z.string().describe("The key/name of the environment variable (e.g., 'DATABASE_URL')"),
  value: z.string().describe("The value of the environment variable"),
});

export type CreateEnvironmentVariableInput = z.infer<typeof createEnvironmentVariableSchema>;

export async function createEnvironmentVariable(
  args: CreateEnvironmentVariableInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(CREATE_ENVIRONMENT_VARIABLE_MUTATION, {
    serviceID: args.serviceId,
    environmentID: args.environmentId,
    key: args.key,
    value: args.value,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

// Update Environment Variable
export const updateEnvironmentVariableSchema = z.object({
  serviceId: z.string().describe("ID of the service to update the environment variable for. Get this from listServices."),
  environmentId: z.string().describe("ID of the environment. Get this from listServices under project.environments."),
  oldKey: z.string().describe("The current key/name of the environment variable to update"),
  newKey: z.string().describe("The new key/name for the environment variable (can be the same as oldKey if only updating value)"),
  value: z.string().describe("The new value of the environment variable"),
});

export type UpdateEnvironmentVariableInput = z.infer<typeof updateEnvironmentVariableSchema>;

export async function updateEnvironmentVariable(
  args: UpdateEnvironmentVariableInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(UPDATE_ENVIRONMENT_VARIABLE_MUTATION, {
    serviceID: args.serviceId,
    environmentID: args.environmentId,
    oldKey: args.oldKey,
    newKey: args.newKey,
    value: args.value,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

// Delete Environment Variable
export const deleteEnvironmentVariableSchema = z.object({
  serviceId: z.string().describe("ID of the service to delete the environment variable from. Get this from listServices."),
  environmentId: z.string().describe("ID of the environment. Get this from listServices under project.environments."),
  key: z.string().describe("The key/name of the environment variable to delete"),
});

export type DeleteEnvironmentVariableInput = z.infer<typeof deleteEnvironmentVariableSchema>;

export async function deleteEnvironmentVariable(
  args: DeleteEnvironmentVariableInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(DELETE_ENVIRONMENT_VARIABLE_MUTATION, {
    serviceID: args.serviceId,
    environmentID: args.environmentId,
    key: args.key,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

// Get Service Variables
export const getServiceVariablesSchema = z.object({
  serviceId: z.string().describe("ID of the service to get environment variables for. Get this from listServices."),
  environmentId: z.string().describe("ID of the environment. Get this from listServices under project.environments."),
});

export type GetServiceVariablesInput = z.infer<typeof getServiceVariablesSchema>;

export async function getServiceVariables(
  args: GetServiceVariablesInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(GET_SERVICE_VARIABLES_QUERY, {
    serviceID: args.serviceId,
    environmentID: args.environmentId,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}
