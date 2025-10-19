import { z } from "zod";

export const renderRegionSelectorSchema = z.object({
  showServers: z.boolean(),
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
  showCreateNew: z.boolean(),
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
  projectID: z.string(),
  serviceID: z.string(),
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
  dockerfile: z.string(),
  language: z.string().default("dockerfile"),
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
    label: z.string(),
  })),
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
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  isExternal: z.boolean().default(true),
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