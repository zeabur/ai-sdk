// Core tool functions - can be used directly without MCP
export * from "./command.js";
export * from "./files.js";
export * from "./graphql.js";
export * from "./logs.js";
export * from "./metrics.js";
export * from "./template.js";
export * from "./render.js";
export * from "./project.js";
export * from "./region.js";
export * from "./service.js";
export * from "./port.js";
export * from "./domain.js";
export * from "./user.js";
export * from "./git.js";
export * from "./variable.js";
export * from "./status.js";
export * from "./aihub.js";

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
  getServerMetrics,
  getServerMetricsSchema,
  getServiceMetrics,
  getServiceMetricsSchema,
  type GetServerMetricsInput,
  type GetServiceMetricsInput
} from "./metrics.js";

import {
  searchTemplate,
  searchTemplateSchema,
  deployTemplate,
  deployTemplateSchema,
  type SearchTemplateInput,
  type DeployTemplateInput
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

import {
  listProjects,
  listProjectsSchema,
  createProject,
  createProjectSchema,
  type ListProjectsInput,
  type CreateProjectInput
} from "./project.js";

import {
  listRegions,
  listRegionsSchema,
  type ListRegionsInput
} from "./region.js";

import {
  listServices,
  listServicesSchema,
  getService,
  getServiceSchema,
  createService,
  createServiceSchema,
  type ListServicesInput,
  type GetServiceInput,
  type CreateServiceInput
} from "./service.js";

import {
  updateServicePorts,
  updateServicePortsSchema,
  type UpdateServicePortsInput
} from "./port.js";

import {
  addDomain,
  addDomainSchema,
  type AddDomainInput
} from "./domain.js";

import {
  getMe,
  getMeSchema,
  type GetMeInput
} from "./user.js";

import {
  getRepoId,
  getRepoIdSchema,
  searchGitRepos,
  searchGitReposSchema,
  type GetRepoIdInput,
  type SearchGitReposInput
} from "./git.js";

import {
  createEnvironmentVariable,
  createEnvironmentVariableSchema,
  updateEnvironmentVariable,
  updateEnvironmentVariableSchema,
  deleteEnvironmentVariable,
  deleteEnvironmentVariableSchema,
  getServiceVariables,
  getServiceVariablesSchema,
  type CreateEnvironmentVariableInput,
  type UpdateEnvironmentVariableInput,
  type DeleteEnvironmentVariableInput,
  type GetServiceVariablesInput
} from "./variable.js";

import {
  waitForServicesRunning,
  waitForServicesRunningSchema,
  type WaitForServicesRunningInput
} from "./status.js";

import {
  getAIHubTenant,
  getAIHubTenantSchema,
  getAIHubMonthlyUsage,
  getAIHubMonthlyUsageSchema,
  createAIHubKey,
  createAIHubKeySchema,
  deleteAIHubKey,
  deleteAIHubKeySchema,
  type GetAIHubTenantInput,
  type GetAIHubMonthlyUsageInput,
  type CreateAIHubKeyInput,
  type DeleteAIHubKeyInput
} from "./aihub.js";

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
  getServerMetrics,
  getServiceMetrics,

  // Templates
  searchTemplate,
  deployTemplate,

  // Projects
  listProjects,
  createProject,

  // Regions
  listRegions,

  // Services
  listServices,
  getService,
  createService,

  // Ports
  updateServicePorts,

  // Domains
  addDomain,

  // User
  getMe,

  // Git
  getRepoId,
  searchGitRepos,

  // Environment Variables
  createEnvironmentVariable,
  updateEnvironmentVariable,
  deleteEnvironmentVariable,
  getServiceVariables,

  // UI Rendering
  renderRegionSelector,
  renderProjectSelector,
  renderServiceCard,
  renderDockerfile,
  renderRecommendation,
  renderFloatingButton,

  // Status
  waitForServicesRunning,

  // AI Hub
  getAIHubTenant,
  getAIHubMonthlyUsage,
  createAIHubKey,
  deleteAIHubKey,
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
  getServerMetricsSchema,
  getServiceMetricsSchema,
  searchTemplateSchema,
  deployTemplateSchema,
  listProjectsSchema,
  createProjectSchema,
  listRegionsSchema,
  listServicesSchema,
  getServiceSchema,
  createServiceSchema,
  updateServicePortsSchema,
  addDomainSchema,
  getMeSchema,
  getRepoIdSchema,
  searchGitReposSchema,
  createEnvironmentVariableSchema,
  updateEnvironmentVariableSchema,
  deleteEnvironmentVariableSchema,
  getServiceVariablesSchema,
  renderRegionSelectorSchema,
  renderProjectSelectorSchema,
  renderServiceCardSchema,
  renderDockerfileSchema,
  renderRecommendationSchema,
  renderFloatingButtonSchema,
  waitForServicesRunningSchema,
  getAIHubTenantSchema,
  getAIHubMonthlyUsageSchema,
  createAIHubKeySchema,
  deleteAIHubKeySchema,
};
