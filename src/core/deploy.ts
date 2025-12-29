import { z } from "zod";
import { ZeaburContext, DeployFromSpecificationSpecification } from "../types/index.js";
import { decideFilesystemFromSchema } from "./files.js";

const DEPLOY_FROM_SPECIFICATION_GQL = `
mutation DeployFromSpecification($serviceId: ObjectID!, $specification: DeploymentSpecification!) {
  deployFromSpecification(serviceID: $serviceId, specification: $specification) {
    deploymentID
  }
}
`;

const sourceSchema = z.object({
  type: z.enum(["GITHUB", "UPLOAD_ID"]).describe("The source type for building."),
  github: z.object({
    repo_id: z.number().describe("The GitHub repository ID. Get this from getRepoId."),
    ref: z.string().optional().describe("Optional git ref (branch, tag, or commit SHA)."),
  }).optional().describe("Required when type is 'GITHUB'."),
  upload_id: z.string().optional().describe("Required when type is 'UPLOAD_ID'."),
});

export const deployFromSpecificationSchema = z.object({
  service_id: z.string().describe("The service ID to deploy to. Get this from listServices or createService."),
  source: z.object({
    type: z.enum(["BUILD_FROM_SOURCE", "DOCKER_IMAGE"]).describe("The deployment source type."),
    build_from_source: z.object({
      source: sourceSchema,
      dockerfile: z.object({
        content: z.string().nullable().optional().describe("The Dockerfile content directly."),
        path: z.string().nullable().optional().describe("The path to Dockerfile in the source (e.g., '/Dockerfile')."),
      }).describe("Dockerfile specification. Provide either 'content' or 'path'."),
    }).optional().describe("Required when type is 'BUILD_FROM_SOURCE'."),
    docker_image: z.string().optional().describe("Required when type is 'DOCKER_IMAGE'. The Docker image to deploy (e.g., 'nginx:latest')."),
  }).describe("The deployment source configuration."),
  env: z.array(z.object({
    key: z.string().describe("Environment variable name."),
    value: z.string().describe("Environment variable value."),
    expose: z.boolean().default(false).describe("Whether to expose this variable publicly."),
  })).describe("Environment variables for the deployment."),
});

export type DeployFromSpecificationInput = z.infer<typeof deployFromSpecificationSchema>;

export async function deployFromSpecification(
  args: DeployFromSpecificationInput,
  context: ZeaburContext
): Promise<string> {
  let spec: DeployFromSpecificationSpecification = {
    source: {},
    env: args.env.map((e) => ({
      key: e.key,
      default: e.value,
      expose: e.expose,
    })),
  };

  switch (args.source.type) {
    case "BUILD_FROM_SOURCE":
      if (!args.source.build_from_source) {
        throw new Error("When the source type is 'BUILD_FROM_SOURCE', you must specify the 'build_from_source' object.");
      }

      const fs = decideFilesystemFromSchema(context.graphql, args.source.build_from_source.source);
      const dockerfileContent = await getDockerfileContent(fs, args.source.build_from_source.dockerfile);

      switch (args.source.build_from_source.source.type) {
        case "GITHUB":
          spec.source = {
            source: "GITHUB",
            repoID: args.source.build_from_source.source.github?.repo_id,
            branch: args.source.build_from_source.source.github?.ref ?? undefined,
            dockerfile: dockerfileContent,
          };
          break;
        case "UPLOAD_ID":
          spec.source = {
            source: "UPLOAD_ID",
            uploadID: args.source.build_from_source.source.upload_id ?? undefined,
            dockerfile: dockerfileContent,
          };
          break;
        default:
          throw new Error("Invalid 'build_from_source' source type");
      }
      break;
    case "DOCKER_IMAGE":
      spec.source = {
        image: args.source.docker_image ?? undefined,
      };
      break;
    default:
      throw new Error("Invalid 'source' type");
  }

  const result = await context.graphql.query(DEPLOY_FROM_SPECIFICATION_GQL, {
    serviceId: args.service_id,
    specification: spec,
  });

  return JSON.stringify(result);
}

async function getDockerfileContent(fs: any, dockerfile: { content?: string | null, path?: string | null }) {
  if (dockerfile.content) {
    return dockerfile.content;
  }

  if (dockerfile.path) {
    return await fs.read(dockerfile.path);
  }

  throw new Error("No Dockerfile content provided. You should specify 'content' or 'path' in the Dockerfile object.");
}