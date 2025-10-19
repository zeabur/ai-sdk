import { z } from "zod";
import { ZeaburContext } from "../types/index.js";

export const searchTemplateSchema = z.object({
  query: z.string(),
  category: z.string().optional(),
  limit: z.number().default(10),
});

export type SearchTemplateInput = z.infer<typeof searchTemplateSchema>;

export async function searchTemplate(
  args: SearchTemplateInput,
  context: ZeaburContext
): Promise<string> {
  const query = `
    query SearchTemplates($query: String!, $category: String, $limit: Int) {
      templates(search: $query, category: $category, limit: $limit) {
        _id
        name
        description
        category
        tags
        readme
        config
      }
    }
  `;

  const response = await context.graphql.query(query, {
    query: args.query,
    category: args.category,
    limit: args.limit
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}