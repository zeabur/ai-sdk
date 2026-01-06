import { z } from "zod/v4";
import { ZeaburContext } from "../types/index.js";

const LIST_REGIONS_QUERY = `
query ListRegions {
  regions {
    id
    code
    name
    description
    available
    continent
    country
    city
    providerInfo {
      name
      code
    }
  }
}
`;

const LIST_SERVERS_QUERY = `
query ListServers {
  servers {
    _id
    name
    ip
    status {
      isOnline
      totalCPU
      usedCPU
      totalMemory
      usedMemory
      vmStatus
    }
    providerInfo {
      name
      code
    }
    country
    city
    continent
    createdAt
    isManaged
    expiresAt
  }
}
`;

export const listRegionsSchema = z.object({
  includeServers: z.boolean().optional().describe("Whether to include dedicated servers in the result"),
});

export type ListRegionsInput = z.infer<typeof listRegionsSchema>;

export async function listRegions(
  args: ListRegionsInput,
  context: ZeaburContext
): Promise<string> {
  const regionsResponse = await context.graphql.query(LIST_REGIONS_QUERY);

  if (regionsResponse.errors) {
    throw new Error(JSON.stringify(regionsResponse.errors));
  }

  const result: any = {
    regions: regionsResponse.data.regions,
  };

  if (args.includeServers) {
    const serversResponse = await context.graphql.query(LIST_SERVERS_QUERY);

    if (serversResponse.errors) {
      throw new Error(JSON.stringify(serversResponse.errors));
    }

    result.servers = serversResponse.data.servers;
  }

  return JSON.stringify(result);
}
