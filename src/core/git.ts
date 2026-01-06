import { z } from "zod/v4";
import { ZeaburContext } from "../types/index.js";

// Get Repo ID from GitHub URL
const GET_REPO_ID_QUERY = `
query GetRepoId($url: String!) {
  getRepoId(url: $url) {
    id
    full_name
  }
}
`;

export const getRepoIdSchema = z.object({
  url: z.string().describe("Full GitHub repository URL (e.g., https://github.com/owner/repo)"),
});

export type GetRepoIdInput = z.infer<typeof getRepoIdSchema>;

export async function getRepoId(
  args: GetRepoIdInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(GET_REPO_ID_QUERY, {
    url: args.url,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

// Search Git Repositories
const SEARCH_GIT_REPOS_QUERY = `
query SearchGitRepositories($provider: GitProvider!, $limit: Int!, $gitNamespaceId: Int, $keyword: String) {
  searchGitRepositories(provider: $provider, Limit: $limit, gitNamespaceID: $gitNamespaceId, keyword: $keyword) {
    id
  }
}
`;

export const searchGitReposSchema = z.object({
  provider: z.enum(["GITHUB", "GITLAB"]).describe("Git provider"),
  keyword: z.string().optional().describe("Search keyword (usually the repo name)"),
  limit: z.number().optional().default(10).describe("Maximum number of results"),
  gitNamespaceId: z.number().optional().describe("Git namespace ID (optional)"),
});

export type SearchGitReposInput = z.infer<typeof searchGitReposSchema>;

export async function searchGitRepos(
  args: SearchGitReposInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(SEARCH_GIT_REPOS_QUERY, {
    provider: args.provider,
    limit: args.limit || 10,
    gitNamespaceId: args.gitNamespaceId,
    keyword: args.keyword,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}
