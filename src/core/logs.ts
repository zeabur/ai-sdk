import { z } from "zod";
import { ZeaburContext } from "../types/index.js";

export const getBuildLogsSchema = z.object({
  deploymentId: z.string().describe("The deployment ID to get build logs for. Get this from getDeployments."),
  timestampCursor: z.string().optional().describe("Optional cursor for pagination. Use the timestamp from the last log entry to get more logs."),
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
  serviceId: z.string().describe("The service ID to get runtime logs for. Get this from listServices or getService."),
  deploymentId: z.string().describe("The deployment ID (required). Get this from getDeployments."),
  timestampCursor: z.string().optional().describe("Optional cursor for pagination."),
});

export type GetRuntimeLogsInput = z.infer<typeof getRuntimeLogsSchema>;

export async function getRuntimeLogs(
  args: GetRuntimeLogsInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    query GetRuntimeLogs($serviceId: ObjectID!, $deploymentId: ObjectID!) {
      runtimeLogs(serviceID: $serviceId, deploymentID: $deploymentId) {
        message
      }
    }
  `;

  const response = await context.graphql.query(query, {
    serviceId: args.serviceId,
    deploymentId: args.deploymentId,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

export const getDeploymentsSchema = z.object({
  serviceId: z.string().describe("The service ID to get deployments for. Get this from listServices or getService."),
  environmentId: z.string().describe("The environment ID to get deployments for. Get this from listProjects (in project.environments)."),
});

export type GetDeploymentsInput = z.infer<typeof getDeploymentsSchema>;

export async function getDeployments(
  args: GetDeploymentsInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    query GetDeployments($serviceId: ObjectID!, $environmentId: ObjectID!) {
      deployments(serviceID: $serviceId, environmentID: $environmentId) {
        edges {
          node {
            _id
            status
            createdAt
            startedAt
          }
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