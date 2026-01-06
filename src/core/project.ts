import { z } from "zod/v4";
import { ZeaburContext } from "../types/index.js";

// List Projects
const LIST_PROJECTS_QUERY = `
query ListProjects {
  projects {
    edges {
      node {
        _id
        name
        region {
          code
          name
        }
        environments {
          _id
          name
        }
      }
    }
  }
}
`;

export const listProjectsSchema = z.object({});

export type ListProjectsInput = z.infer<typeof listProjectsSchema>;

export async function listProjects(
  _args: ListProjectsInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(LIST_PROJECTS_QUERY);

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

// Create Project
const CREATE_PROJECT_MUTATION = `
mutation CreateProject($name: String!, $region: String!) {
  createProject(name: $name, region: $region) {
    _id
  }
}
`;

export const createProjectSchema = z.object({
  name: z.string().describe("Name of the project (alphanumeric, 4-16 chars, hyphens allowed, must start with letter)"),
  region: z.string().describe("Region code for the project. Use 'listRegions' to get available regions. For dedicated servers, use 'server-{SERVER_ID}' format."),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export async function createProject(
  args: CreateProjectInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(CREATE_PROJECT_MUTATION, {
    name: args.name,
    region: args.region,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}
