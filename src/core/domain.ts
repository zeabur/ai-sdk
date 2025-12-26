import { z } from "zod";
import { ZeaburContext } from "../types/index.js";

const ADD_DOMAIN_MUTATION = `
mutation AddDomain($serviceID: ObjectID!, $domain: String!, $isGenerated: Boolean!, $portName: String!) {
  addDomain(serviceID: $serviceID, domain: $domain, isGenerated: $isGenerated, portName: $portName) {
    _id
    domain
    status
  }
}
`;

export const addDomainSchema = z.object({
  serviceId: z.string().describe("ID of the service to add domain to"),
  domain: z.string().describe("Domain name. If isGenerated is true, this should be the subdomain prefix (without .zeabur.app)"),
  isGenerated: z.boolean().describe("Whether this is a generated Zeabur domain (xxx.zeabur.app)"),
  portName: z.string().describe("The port.id exposed on service (e.g., 'web')"),
});

export type AddDomainInput = z.infer<typeof addDomainSchema>;

export async function addDomain(
  args: AddDomainInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(ADD_DOMAIN_MUTATION, {
    serviceID: args.serviceId,
    domain: args.domain,
    isGenerated: args.isGenerated,
    portName: args.portName,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}
