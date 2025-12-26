import { z } from "zod";
import { ZeaburContext } from "../types/index.js";

const QUERY_ALL_TEMPLATES = `
query QueryAllTemplates {
  templates {
    edges {
      node {
        name
        description
        author {
          avatarURL
          username
        }
        variables {
          key
          desc
          type
          question
        }
        code
        createdAt
        deploymentCnt
        iconURL
      }
    }
  }
}
`;

export const searchTemplateSchema = z.object({
  query: z.string().describe('The search query to filter templates by name or description'),
});

export type SearchTemplateInput = z.infer<typeof searchTemplateSchema>;

interface Template {
  node: {
    name: string;
    description: string;
    author: {
      avatarURL: string;
      username: string;
    };
    variables: Array<{
      key: string;
      desc: string;
      type: string;
      question: string;
    }>;
    code: string;
    createdAt: string;
    deploymentCnt: number;
    iconURL: string;
  };
}

interface TemplatesResponse {
  templates: {
    edges: Template[];
  };
}

export async function searchTemplate(
  args: SearchTemplateInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query<TemplatesResponse>(QUERY_ALL_TEMPLATES);

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  // Filter templates on client-side by name or description
  const query = args.query.toLowerCase();
  const filteredTemplates = response.data.templates.edges.filter(
    (template: Template) =>
      template.node.name.toLowerCase().includes(query) ||
      template.node.description.toLowerCase().includes(query)
  );

  return JSON.stringify(filteredTemplates);
}

// Deploy Template
const DEPLOY_TEMPLATE_MUTATION = `
mutation DeployTemplate($code: String!, $variables: Map, $projectID: ObjectID!) {
  deployTemplate(code: $code, variables: $variables, projectID: $projectID) {
    _id
  }
}
`;

export const deployTemplateSchema = z.object({
  code: z.string().describe("Code of the template to deploy"),
  variables: z.record(z.string(), z.any()).optional().describe("Variables for the template. For DOMAIN type variables, provide the subdomain prefix (without .zeabur.app)"),
  projectId: z.string().describe("ID of the project to deploy the template to"),
});

export type DeployTemplateInput = z.infer<typeof deployTemplateSchema>;

export async function deployTemplate(
  args: DeployTemplateInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(DEPLOY_TEMPLATE_MUTATION, {
    code: args.code,
    variables: args.variables || {},
    projectID: args.projectId,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}