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