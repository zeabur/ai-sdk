// Core tool functions - can be used directly without MCP
export * from "./command.js";
export * from "./files.js";
export * from "./graphql.js";
export * from "./logs.js";
export * from "./template.js";
export * from "./render.js";

// Re-export types for convenience
export * from "../types/index.js";

// Deploy needs special handling due to type conflicts
export {
  deployFromSpecification,
  deployFromSpecificationSchema
} from "./deploy.js";
export type { DeployFromSpecificationInput } from "./deploy.js";

// Tool collection for easier usage
import {
  executeCommand,
  executeCommandSchema,
  type ExecuteCommandInput
} from "./command.js";

import {
  deployFromSpecification,
  deployFromSpecificationSchema,
  type DeployFromSpecificationInput
} from "./deploy.js";

import {
  decideFilesystem,
  listFiles,
  readFile,
  fileDirRead,
  decideFilesystemSchema,
  listFilesSchema,
  readFileSchema,
  fileDirReadSchema,
  type DecideFilesystemInput,
  type ListFilesInput,
  type ReadFileInput,
  type FileDirReadInput
} from "./files.js";

import {
  executeGraphql,
  executeGraphqlSchema,
  type ExecuteGraphqlInput
} from "./graphql.js";

import {
  getBuildLogs,
  getRuntimeLogs,
  getDeployments,
  getBuildLogsSchema,
  getRuntimeLogsSchema,
  getDeploymentsSchema,
  type GetBuildLogsInput,
  type GetRuntimeLogsInput,
  type GetDeploymentsInput
} from "./logs.js";

import {
  searchTemplate,
  searchTemplateSchema,
  type SearchTemplateInput
} from "./template.js";

import {
  renderRegionSelector,
  renderProjectSelector,
  renderServiceCard,
  renderDockerfile,
  renderRecommendation,
  renderFloatingButton,
  renderRegionSelectorSchema,
  renderProjectSelectorSchema,
  renderServiceCardSchema,
  renderDockerfileSchema,
  renderRecommendationSchema,
  renderFloatingButtonSchema,
  type RenderRegionSelectorInput,
  type RenderProjectSelectorInput,
  type RenderServiceCardInput,
  type RenderDockerfileInput,
  type RenderRecommendationInput,
  type RenderFloatingButtonInput
} from "./render.js";

// Collection of all tools for easy access
export const zeaburTools = {
  // Core functionality
  executeCommand,
  deployFromSpecification,
  executeGraphql,
  
  // File system
  decideFilesystem,
  listFiles,
  readFile,
  fileDirRead,
  
  // Monitoring
  getBuildLogs,
  getRuntimeLogs,
  getDeployments,
  
  // Templates
  searchTemplate,
  
  // UI Rendering
  renderRegionSelector,
  renderProjectSelector,
  renderServiceCard,
  renderDockerfile,
  renderRecommendation,
  renderFloatingButton,
};

// Collection of all schemas
export const zeaburSchemas = {
  executeCommandSchema,
  deployFromSpecificationSchema,
  executeGraphqlSchema,
  decideFilesystemSchema,
  listFilesSchema,
  readFileSchema,
  fileDirReadSchema,
  getBuildLogsSchema,
  getRuntimeLogsSchema,
  getDeploymentsSchema,
  searchTemplateSchema,
  renderRegionSelectorSchema,
  renderProjectSelectorSchema,
  renderServiceCardSchema,
  renderDockerfileSchema,
  renderRecommendationSchema,
  renderFloatingButtonSchema,
};