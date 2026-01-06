import { z } from "zod/v4";
import { ZeaburContext, Filesystem, GraphQLClient, ExecuteCommandResult } from "../types/index.js";

const MAX_COMMAND_RESPONSE_LENGTH = 2048;

export class UploadIdFilesystem implements Filesystem {
  private graphql: GraphQLClient;
  private uploadId: string;

  constructor(graphql: GraphQLClient, uploadId: string) {
    this.graphql = graphql;
    this.uploadId = uploadId;
  }

  async list(path: string): Promise<string[]> {
    const query = `
      query ListUploadIdFiles($uploadID: ObjectID!, $path: String) {
        files(uploadID: $uploadID, path: $path)
      }
    `;
    const response = await this.graphql.query<{ files: string[] }>(query, {
      uploadID: this.uploadId,
      path: path
    });

    if (response.errors) {
      throw new Error(JSON.stringify(response.errors));
    }

    return response.data.files;
  }

  async read(path: string): Promise<string> {
    const query = `
      query ReadUploadIdFile($uploadID: ObjectID!, $path: String) {
        fileContent(uploadID: $uploadID, path: $path)
      }
    `;

    const response = await this.graphql.query<{ fileContent: string }>(query, {
      uploadID: this.uploadId,
      path: path
    });

    if (response.errors) {
      throw new Error(JSON.stringify(response.errors));
    }

    return response.data.fileContent;
  }
}

export class GitHubFilesystem implements Filesystem {
  private graphql: GraphQLClient;
  private repoId: number;
  private ref: string | null;

  constructor(graphql: GraphQLClient, repoId: number, ref: string | null) {
    this.graphql = graphql;
    this.repoId = repoId;
    this.ref = ref;
  }

  async list(path: string): Promise<string[]> {
    const query = `
      query ListGitHubFiles($repoID: Int!, $ref: String, $path: String) {
        files(gitRef: { repoID: $repoID, ref: $ref }, path: $path)
      }
    `;

    const response = await this.graphql.query<{ files: string[] }>(query, {
      repoID: this.repoId,
      ref: this.ref,
      path: path
    });

    if (response.errors) {
      throw new Error(JSON.stringify(response.errors));
    }

    return response.data.files;
  }

  async read(path: string): Promise<string> {
    const query = `
      query ReadGitHubFile($repoID: Int!, $ref: String, $path: String) {
        fileContent(gitRef: { repoID: $repoID, ref: $ref }, path: $path)
      }
    `;

    const response = await this.graphql.query<{ fileContent: string }>(query, {
      repoID: this.repoId,
      ref: this.ref,
      path: path
    });

    if (response.errors) {
      throw new Error(JSON.stringify(response.errors));
    }

    return response.data.fileContent;
  }
}

export function decideFilesystemFromSchema(graphql: GraphQLClient, source: any): Filesystem {
  switch (source.type) {
    case "GITHUB":
      if (!source.github) {
        throw new Error("No 'github' provided");
      }
      return new GitHubFilesystem(graphql, source.github.repo_id, source.github.ref ?? null);
    case "UPLOAD_ID":
      if (!source.upload_id) {
        throw new Error("No upload_id provided");
      }
      return new UploadIdFilesystem(graphql, source.upload_id);
    default:
      throw new Error(`Invalid filesystem type: ${source.type}`);
  }
}

export const decideFilesystemSchema = z.object({
  type: z.enum(["GITHUB", "UPLOAD_ID"]).describe("The filesystem source type."),
  github: z.object({
    repo_id: z.number().describe("The GitHub repository ID. Get this from getRepoId."),
    ref: z.string().optional().describe("Optional git ref (branch, tag, or commit SHA)."),
  }).optional().describe("Required when type is 'GITHUB'."),
  upload_id: z.string().optional().describe("Required when type is 'UPLOAD_ID'. The upload ID from file upload."),
});

export type DecideFilesystemInput = z.infer<typeof decideFilesystemSchema>;

export async function decideFilesystem(
  args: DecideFilesystemInput,
  context: ZeaburContext
): Promise<string> {
  const filesystem = decideFilesystemFromSchema(context.graphql, args);
  context.filesystem = filesystem;
  return JSON.stringify({ picked: args.type });
}

export const listFilesSchema = z.object({
  path: z.string().describe("The directory path to list files from, e.g. '/' or '/src'."),
  limit: z.number().max(64).default(64).describe("Maximum number of files to return. Defaults to 64."),
  offset: z.number().default(0).describe("Number of files to skip for pagination. Defaults to 0."),
});

export type ListFilesInput = z.infer<typeof listFilesSchema>;

export async function listFiles(
  args: ListFilesInput,
  context: ZeaburContext
): Promise<string> {
  if (!context.filesystem) {
    throw new Error("No filesystem provided. Run 'decide_filesystem' to decide which filesystem to use.");
  }

  const files = await context.filesystem.list(args.path, args.limit, args.offset);
  return JSON.stringify(files);
}

export const readFileSchema = z.object({
  path: z.string().describe("The file path to read, e.g. '/package.json' or '/src/index.ts'."),
  limit: z.number().max(1024).default(256).describe("Maximum number of characters to return. Defaults to 256. Set to 0 to read entire file."),
  offset: z.number().default(0).describe("Character position to start reading from. Defaults to 0."),
});

export type ReadFileInput = z.infer<typeof readFileSchema>;

export async function readFile(
  args: ReadFileInput,
  context: ZeaburContext
): Promise<string> {
  if (!context.filesystem) {
    throw new Error("No filesystem provided. Run 'decide_filesystem' to decide which filesystem to use.");
  }

  const fullContent = await context.filesystem.read(args.path);
  const totalLength = fullContent.length;
  const startPos = args.offset;

  if (args.limit === 0) {
    const content = fullContent.slice(startPos);
    return JSON.stringify({
      content,
      metadata: {
        totalLength,
        startPosition: startPos,
        endPosition: totalLength,
        hasMore: false,
        returnedLength: content.length
      }
    });
  }

  const endPos = Math.min(startPos + args.limit, totalLength);
  const content = fullContent.slice(startPos, endPos);
  const hasMore = endPos < totalLength;

  return JSON.stringify({
    content,
    metadata: {
      totalLength,
      startPosition: startPos,
      endPosition: endPos,
      hasMore,
      returnedLength: content.length,
      nextOffset: hasMore ? endPos : null
    }
  });
}

export const fileDirReadSchema = z.object({
  serviceId: z.string().describe("The service ID to execute command on. Get this from listServices or getService."),
  environmentId: z.string().describe("The environment ID where the service is deployed. Get this from the project's environment."),
  command: z.array(z.string()).describe("The command to execute as an array, e.g. ['ls', '-la'] or ['cat', '/app/config.json']. Only read-only commands are allowed: ls, cat, head, tail, find, grep, tree, pwd, whoami, which, file."),
});

export type FileDirReadInput = z.infer<typeof fileDirReadSchema>;

export async function fileDirRead(
  args: FileDirReadInput,
  context: ZeaburContext
): Promise<string> {
  const allowedCommands = ['ls', 'cat', 'head', 'tail', 'find', 'grep', 'tree', 'pwd', 'whoami', 'which', 'file'];
  const baseCommand = args.command[0];

  if (!allowedCommands.includes(baseCommand)) {
    throw new Error(`Command '${baseCommand}' is not allowed. Only read operations are permitted: ${allowedCommands.join(', ')}`);
  }

  const query = `
    mutation ExecuteCommand($serviceID: ObjectID!, $environmentID: ObjectID!, $command: [String!]!) {
      executeCommand(serviceID: $serviceID, environmentID: $environmentID, command: $command) {
        exitCode
        output
      }
    }
  `;

  const variables = {
    serviceID: args.serviceId,
    environmentID: args.environmentId,
    command: args.command
  };

  const response = await context.graphql.query<{ executeCommand: ExecuteCommandResult }>(query, variables);

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  const output = response.data.executeCommand.output ?? "";
  let truncatedResponse = output.slice(0, MAX_COMMAND_RESPONSE_LENGTH)
    + (output.length > MAX_COMMAND_RESPONSE_LENGTH ? '... (truncated)' : '');

  if (response.data.executeCommand.exitCode !== 0) {
    truncatedResponse = `(exit code ${response.data.executeCommand.exitCode}) ` + truncatedResponse;
  }

  return truncatedResponse;
}