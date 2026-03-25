import { z } from "zod/v4";
import { ZeaburContext } from "../types/index.js";

const RAG_BASE_URL = "https://kb.zeabur.com";

function getRagApiKey(context: ZeaburContext): string {
  if (!context.ragApiKey) {
    throw new Error("ragApiKey is required in ZeaburContext for RAG tools");
  }
  return context.ragApiKey;
}

async function ragFetch(path: string, body: Record<string, any>, apiKey: string): Promise<any> {
  const response = await fetch(`${RAG_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`RAG API error (${response.status}): ${text}`);
  }

  return response.json();
}

// Query Zeabur Knowledge Base
export const queryZeaburKnowledgeBaseSchema = z.object({
  query: z.string().describe("The search query to find relevant knowledge."),
  top_k: z.number().optional().describe("Number of top results to return. Defaults to 5."),
});

export type QueryZeaburKnowledgeBaseInput = z.infer<typeof queryZeaburKnowledgeBaseSchema>;

export async function queryZeaburKnowledgeBase(
  args: QueryZeaburKnowledgeBaseInput,
  context: ZeaburContext
): Promise<string> {
  const apiKey = getRagApiKey(context);
  const result = await ragFetch("/api/query", {
    query: args.query,
    top_k: args.top_k ?? 5,
  }, apiKey);
  return JSON.stringify(result);
}

// Report Knowledge Issue
export const reportKnowledgeIssueSchema = z.object({
  type: z.enum(["outdated", "incorrect", "missing"]).describe("The type of issue: outdated, incorrect, or missing."),
  chunk_id: z.string().describe("The chunk ID of the knowledge to report (e.g. SUP-1234)."),
  detail: z.string().describe("Description of what is wrong with this knowledge."),
});

export type ReportKnowledgeIssueInput = z.infer<typeof reportKnowledgeIssueSchema>;

export async function reportKnowledgeIssue(
  args: ReportKnowledgeIssueInput,
  context: ZeaburContext
): Promise<string> {
  const apiKey = getRagApiKey(context);
  const result = await ragFetch("/api/report", {
    type: args.type,
    chunk_id: args.chunk_id,
    detail: args.detail,
  }, apiKey);
  return JSON.stringify(result);
}

// Contribute New Knowledge
export const contributeNewKnowledgeSchema = z.object({
  title: z.string().describe("Title of the new knowledge entry."),
  content: z.string().describe("Content of the knowledge entry. Supports Markdown."),
  tags: z.array(z.string()).optional().describe("Optional tags for categorization."),
});

export type ContributeNewKnowledgeInput = z.infer<typeof contributeNewKnowledgeSchema>;

export async function contributeNewKnowledge(
  args: ContributeNewKnowledgeInput,
  context: ZeaburContext
): Promise<string> {
  const apiKey = getRagApiKey(context);
  const result = await ragFetch("/api/learn", {
    title: args.title,
    content: args.content,
    tags: args.tags,
  }, apiKey);
  return JSON.stringify(result);
}
