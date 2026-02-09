import { z } from "zod/v4";
import { ZeaburContext } from "../types/index.js";

export const getServerMetricsSchema = z.object({
  serverID: z.string().describe("The server ID to get metrics for."),
  type: z.enum(["CPU", "MEMORY", "NETWORK", "DISK", "LATENCY"]).describe("The type of metric to query."),
  startTime: z.string().optional().describe("The start time for the metric range (ISO 8601 format). Defaults to 1 hour ago if not provided."),
  endTime: z.string().optional().describe("The end time for the metric range (ISO 8601 format). Defaults to now if not provided."),
});

export type GetServerMetricsInput = z.infer<typeof getServerMetricsSchema>;

export async function getServerMetrics(
  args: GetServerMetricsInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    query ServerMetrics(
      $serverID: ObjectID!
      $type: MetricType!
      $startTime: Time!
      $endTime: Time!
    ) {
      server(_id: $serverID) {
        metrics(metricType: $type, startTime: $startTime, endTime: $endTime) {
          labels
          values {
            timestamp
            value
          }
        }
      }
    }
  `;

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const response = await context.graphql.query(query, {
    serverID: args.serverID,
    type: args.type,
    startTime: args.startTime ?? oneHourAgo.toISOString(),
    endTime: args.endTime ?? now.toISOString(),
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}
