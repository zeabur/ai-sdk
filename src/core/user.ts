import { z } from "zod/v4";
import { ZeaburContext } from "../types/index.js";

const GET_ME_QUERY = `
query GetMe {
  me {
    _id
    name
    email
    language
    githubID
    discordID
    avatarURL
    createdAt
    referralCode
    username
    credit
    subscription {
      plan
    }
  }
}
`;

export const getMeSchema = z.object({});

export type GetMeInput = z.infer<typeof getMeSchema>;

export async function getMe(
  _args: GetMeInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(GET_ME_QUERY);

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}
