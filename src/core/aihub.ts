import { z } from "zod/v4";
import { ZeaburContext } from "../types/index.js";

// Get AI Hub Tenant (balance + keys)
const GET_AIHUB_TENANT_QUERY = `
query GetAIHubTenant {
  aihubTenant {
    balance
    keys {
      keyID
      alias
      cost
    }
  }
}
`;

export const getAIHubTenantSchema = z.object({});

export type GetAIHubTenantInput = z.infer<typeof getAIHubTenantSchema>;

export async function getAIHubTenant(
  _args: GetAIHubTenantInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(GET_AIHUB_TENANT_QUERY);

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

// Get AI Hub Monthly Usage
const GET_AIHUB_MONTHLY_USAGE_QUERY = `
query GetAIHubMonthlyUsage($month: String) {
  aihubMonthlyUsage(month: $month) {
    totalSpend
    dailyUsage {
      date
      spend
      models {
        model
        cost
      }
    }
    modelsCost {
      model
      cost
    }
  }
}
`;

export const getAIHubMonthlyUsageSchema = z.object({
  month: z.string().optional().describe("Month in YYYY-MM format. Defaults to current month if omitted."),
});

export type GetAIHubMonthlyUsageInput = z.infer<typeof getAIHubMonthlyUsageSchema>;

export async function getAIHubMonthlyUsage(
  args: GetAIHubMonthlyUsageInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(GET_AIHUB_MONTHLY_USAGE_QUERY, {
    month: args.month,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

// Create AI Hub Key
const CREATE_AIHUB_KEY_MUTATION = `
mutation CreateAIHubKey($alias: String) {
  createAIHubKey(alias: $alias) {
    key {
      keyID
      alias
      cost
    }
  }
}
`;

export const createAIHubKeySchema = z.object({
  alias: z.string().optional().describe("Optional user-defined alias for the API key."),
});

export type CreateAIHubKeyInput = z.infer<typeof createAIHubKeySchema>;

export async function createAIHubKey(
  args: CreateAIHubKeyInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(CREATE_AIHUB_KEY_MUTATION, {
    alias: args.alias,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

// Delete AI Hub Key
const DELETE_AIHUB_KEY_MUTATION = `
mutation DeleteAIHubKey($keyID: String!) {
  deleteAIHubKey(keyID: $keyID)
}
`;

export const deleteAIHubKeySchema = z.object({
  keyID: z.string().describe("The key ID to delete. Get this from getAIHubTenant."),
});

export type DeleteAIHubKeyInput = z.infer<typeof deleteAIHubKeySchema>;

export async function deleteAIHubKey(
  args: DeleteAIHubKeyInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(DELETE_AIHUB_KEY_MUTATION, {
    keyID: args.keyID,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}
