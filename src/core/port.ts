import { z } from "zod";
import { ZeaburContext } from "../types/index.js";

const UPDATE_SERVICE_PORTS_MUTATION = `
mutation UpdateServicePorts($serviceID: ObjectID!, $environmentID: ObjectID!, $ports: [ServiceSpecPortInput!]!) {
  updateServicePorts(serviceID: $serviceID, environmentID: $environmentID, ports: $ports)
}
`;

export const updateServicePortsSchema = z.object({
  serviceId: z.string().describe("ID of the service to update ports for"),
  environmentId: z.string().describe("ID of the environment"),
  ports: z.array(z.object({
    id: z.string().describe("Port identifier (e.g., 'web')"),
    port: z.number().describe("Port number (e.g., 8080)"),
    type: z.enum(["HTTP", "TCP", "UDP"]).describe("Port type"),
  })).describe("Array of ports to set. This will replace all existing ports."),
});

export type UpdateServicePortsInput = z.infer<typeof updateServicePortsSchema>;

export async function updateServicePorts(
  args: UpdateServicePortsInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(UPDATE_SERVICE_PORTS_MUTATION, {
    serviceID: args.serviceId,
    environmentID: args.environmentId,
    ports: args.ports,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}
