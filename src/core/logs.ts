import { z } from "zod";
import { ZeaburContext } from "../types/index.js";

export const getBuildLogsSchema = z.object({
  deploymentId: z.string(),
  limit: z.number().default(100),
});

export type GetBuildLogsInput = z.infer<typeof getBuildLogsSchema>;

export async function getBuildLogs(
  args: GetBuildLogsInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    query GetBuildLogs($deploymentId: ObjectID!, $limit: Int) {
      buildLogs(deploymentID: $deploymentId, limit: $limit) {
        timestamp
        message
        level
      }
    }
  `;

  const response = await context.graphql.query(query, {
    deploymentId: args.deploymentId,
    limit: args.limit
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

export const getRuntimeLogsSchema = z.object({
  serviceId: z.string(),
  environmentId: z.string(),
  limit: z.number().default(100),
});

export type GetRuntimeLogsInput = z.infer<typeof getRuntimeLogsSchema>;

export async function getRuntimeLogs(
  args: GetRuntimeLogsInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    query GetRuntimeLogs($serviceId: ObjectID!, $environmentId: ObjectID!, $limit: Int) {
      runtimeLogs(serviceID: $serviceId, environmentID: $environmentId, limit: $limit) {
        timestamp
        message
        level
      }
    }
  `;

  const response = await context.graphql.query(query, {
    serviceId: args.serviceId,
    environmentId: args.environmentId,
    limit: args.limit
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

export const getDeploymentsSchema = z.object({
  serviceId: z.string(),
  limit: z.number().default(10),
});

export type GetDeploymentsInput = z.infer<typeof getDeploymentsSchema>;

export async function getDeployments(
  args: GetDeploymentsInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    query GetDeployments($serviceId: ObjectID!, $limit: Int) {
      service(id: $serviceId) {
        deployments(limit: $limit) {
          _id
          status
          createdAt
          updatedAt
        }
      }
    }
  `;

  const response = await context.graphql.query(query, {
    serviceId: args.serviceId,
    limit: args.limit
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}