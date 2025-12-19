import { z } from "zod";
import { ZeaburContext } from "../types/index.js";

export const getBuildLogsSchema = z.object({
  deploymentId: z.string(),
  timestampCursor: z.string().optional(),
});

export type GetBuildLogsInput = z.infer<typeof getBuildLogsSchema>;

export async function getBuildLogs(
  args: GetBuildLogsInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    query BuildLogs($deploymentId: ObjectID!, $timestampCursor: Time) {
      buildLogs(deploymentID: $deploymentId, timestampCursor: $timestampCursor) {
        message
        timestamp
      }
    }
  `;

  const response = await context.graphql.query(query, {
    deploymentId: args.deploymentId,
    timestampCursor: args.timestampCursor,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

export const getRuntimeLogsSchema = z.object({
  serviceId: z.string(),
  environmentId: z.string(),
  timestampCursor: z.string().optional(),
});

export type GetRuntimeLogsInput = z.infer<typeof getRuntimeLogsSchema>;

export async function getRuntimeLogs(
  args: GetRuntimeLogsInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    query GetRuntimeLogs($serviceId: ObjectID!, $environmentId: ObjectID, $timestampCursor: Time) {
      runtimeLogs(serviceID: $serviceId, environmentID: $environmentId, timestampCursor: $timestampCursor) {
        timestamp
        message
        stream
        region
        zeaburUID
      }
    }
  `;

  const response = await context.graphql.query(query, {
    serviceId: args.serviceId,
    environmentId: args.environmentId,
    timestampCursor: args.timestampCursor
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

export const getDeploymentsSchema = z.object({
  serviceId: z.string(),
  environmentId: z.string().optional(),
});

export type GetDeploymentsInput = z.infer<typeof getDeploymentsSchema>;

export async function getDeployments(
  args: GetDeploymentsInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    query GetDeployments($serviceId: ObjectID!, $environmentId: ObjectID) {
      service(_id: $serviceId) {
        deployments(environmentID: $environmentId) {
          _id
          status
          createdAt
          startedAt
        }
      }
    }
  `;

  const response = await context.graphql.query(query, {
    serviceId: args.serviceId,
    environmentId: args.environmentId,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}