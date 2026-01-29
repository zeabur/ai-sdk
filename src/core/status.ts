import { z } from "zod/v4";
import { ZeaburContext } from "../types/index.js";

// GraphQL query to get service status
const GET_SERVICE_STATUS_QUERY = `
query GetServiceStatus($id: ObjectID!) {
  service(_id: $id) {
    _id
    name
    status
  }
}
`;

// Service deployment status enum values
export const ServiceStatus = {
  RUNNING: "RUNNING",
  CRASHED: "CRASHED",
  PULL_FAILED: "PULL_FAILED",
  BUILDING: "BUILDING",
  PENDING: "PENDING",
  STARTING: "STARTING",
  SUSPENDED: "SUSPENDED",
  STOPPING: "STOPPING",
  UNKNOWN: "UNKNOWN",
} as const;

// Failed statuses that should immediately return failure
const FAILED_STATUSES = [ServiceStatus.CRASHED, ServiceStatus.PULL_FAILED];

// Schema definition
export const waitForServicesRunningSchema = z
  .object({
    serviceIds: z
      .array(z.string())
      .nonempty("At least one service ID is required")
      .describe("List of service IDs to wait for"),
    timeout: z
      .number()
      .positive("Timeout must be greater than 0")
      .default(300000)
      .describe("Maximum wait time in ms (default: 5 min)"),
    pollInterval: z
      .number()
      .positive("Poll interval must be greater than 0")
      .default(5000)
      .describe("Poll interval in ms (default: 5 sec)"),
  })
  .refine((data) => data.timeout >= data.pollInterval, {
    message: "Timeout must be greater than or equal to pollInterval",
    path: ["timeout"],
  });

export type WaitForServicesRunningInput = z.infer<typeof waitForServicesRunningSchema>;

interface ServiceStatusResult {
  serviceId: string;
  serviceName: string;
  status: string;
}

interface WaitResult {
  success: boolean;
  message: string;
  elapsedTime: number;
  services: ServiceStatusResult[];
  failedServices: ServiceStatusResult[];
}

/**
 * Helper function to sleep for a given number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Get the current status of a service
 */
async function getServiceStatus(
  serviceId: string,
  context: ZeaburContext
): Promise<ServiceStatusResult> {
  const response = await context.graphql.query(GET_SERVICE_STATUS_QUERY, {
    id: serviceId,
  });

  if (response.errors) {
    throw new Error(`Failed to get service status: ${JSON.stringify(response.errors)}`);
  }

  const service = response.data?.service;

  if (!service) {
    return {
      serviceId,
      serviceName: "Unknown",
      status: ServiceStatus.UNKNOWN,
    };
  }

  return {
    serviceId,
    serviceName: service.name || "Unknown",
    status: service.status || ServiceStatus.UNKNOWN,
  };
}

/**
 * Wait for all specified services to reach RUNNING status
 * Polls until all services are running, timeout, or any service fails
 */
export async function waitForServicesRunning(
  args: WaitForServicesRunningInput,
  context: ZeaburContext
): Promise<string> {
  const { serviceIds, timeout, pollInterval } = args;
  const startTime = Date.now();

  while (true) {
    const elapsedTime = Date.now() - startTime;

    // Check timeout
    if (elapsedTime >= timeout) {
      const services = await Promise.all(
        serviceIds.map((id) => getServiceStatus(id, context))
      );
      const result: WaitResult = {
        success: false,
        message: `Timeout after ${elapsedTime}ms. Some services did not reach RUNNING status.`,
        elapsedTime,
        services,
        failedServices: services.filter((s) => s.status !== ServiceStatus.RUNNING),
      };
      return JSON.stringify(result);
    }

    // Get current status of all services
    const services = await Promise.all(
      serviceIds.map((id) => getServiceStatus(id, context))
    );

    // Check for failed services
    const failedServices = services.filter((s) =>
      FAILED_STATUSES.includes(s.status as any)
    );
    if (failedServices.length > 0) {
      const result: WaitResult = {
        success: false,
        message: `Service(s) failed: ${failedServices.map((s) => `${s.serviceName} (${s.status})`).join(", ")}`,
        elapsedTime,
        services,
        failedServices,
      };
      return JSON.stringify(result);
    }

    // Check if all services are running
    const allRunning = services.every((s) => s.status === ServiceStatus.RUNNING);
    if (allRunning) {
      const result: WaitResult = {
        success: true,
        message: `All services are now running after ${elapsedTime}ms`,
        elapsedTime,
        services,
        failedServices: [],
      };
      return JSON.stringify(result);
    }

    // Wait before next poll
    await sleep(pollInterval);
  }
}
