import { z } from "zod/v4";

export const renderRegionSelectorSchema = z.object({
  showServers: z.boolean().describe("Whether to show dedicated servers in addition to shared regions."),
});

export type RenderRegionSelectorInput = z.infer<typeof renderRegionSelectorSchema>;

export async function renderRegionSelector(
  args: RenderRegionSelectorInput
): Promise<string> {
  return JSON.stringify({
    type: 'region-selector',
    showServers: args.showServers
  });
}

export const renderProjectSelectorSchema = z.object({
  showCreateNew: z.boolean().describe("Whether to show the 'Create New Project' option."),
});

export type RenderProjectSelectorInput = z.infer<typeof renderProjectSelectorSchema>;

export async function renderProjectSelector(
  args: RenderProjectSelectorInput
): Promise<string> {
  return JSON.stringify({
    type: 'project-selector',
    showCreateNew: args.showCreateNew
  });
}

export const renderServiceCardSchema = z.object({
  projectID: z.string().describe("The project ID that contains the service."),
  serviceID: z.string().describe("The service ID to display."),
});

export type RenderServiceCardInput = z.infer<typeof renderServiceCardSchema>;

export async function renderServiceCard(
  args: RenderServiceCardInput
): Promise<string> {
  return JSON.stringify({
    type: 'service-card',
    projectID: args.projectID,
    serviceID: args.serviceID
  });
}

export const renderDockerfileSchema = z.object({
  dockerfile: z.string().describe("The Dockerfile content to display."),
  language: z.string().default("dockerfile").describe("The syntax highlighting language. Defaults to 'dockerfile'."),
});

export type RenderDockerfileInput = z.infer<typeof renderDockerfileSchema>;

export async function renderDockerfile(
  args: RenderDockerfileInput
): Promise<string> {
  return JSON.stringify({
    type: 'dockerfile',
    content: args.dockerfile,
    language: args.language || 'dockerfile'
  });
}

export const renderRecommendationSchema = z.object({
  options: z.array(z.object({
    label: z.string().describe("The label text for this recommendation option."),
  })).describe("Array of recommendation options to display."),
});

export type RenderRecommendationInput = z.infer<typeof renderRecommendationSchema>;

export async function renderRecommendation(
  args: RenderRecommendationInput
): Promise<string> {
  return JSON.stringify({
    type: 'recommendation',
    options: args.options
  });
}

export const renderFloatingButtonSchema = z.object({
  url: z.string().describe("The URL to navigate to when clicked."),
  title: z.string().optional().describe("The button title text."),
  description: z.string().optional().describe("Optional description text below the title."),
  isExternal: z.boolean().default(true).describe("Whether to open in a new tab. Defaults to true."),
});

export type RenderFloatingButtonInput = z.infer<typeof renderFloatingButtonSchema>;

export async function renderFloatingButton(
  args: RenderFloatingButtonInput
): Promise<string> {
  return JSON.stringify({
    type: 'floating-button',
    url: args.url,
    title: args.title || 'Visit Website',
    description: args.description,
    isExternal: args.isExternal
  });
}