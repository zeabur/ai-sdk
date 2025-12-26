import { z } from "zod";
import { ZeaburContext } from "../types/index.js";

// List Services
const LIST_SERVICES_QUERY = `
query ListServices($projectID: ObjectID!) {
  services(projectID: $projectID) {
    edges {
      node {
        _id
        name
        template
        createdAt
        status
      }
    }
  }
}
`;

export const listServicesSchema = z.object({
  projectId: z.string().describe("ID of the project to list services from"),
});

export type ListServicesInput = z.infer<typeof listServicesSchema>;

export async function listServices(
  args: ListServicesInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(LIST_SERVICES_QUERY, {
    projectID: args.projectId,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

// Get Service
const GET_SERVICE_QUERY = `
query GetService($id: ObjectID!) {
  service(_id: $id) {
    _id
    name
    template
    createdAt
    status
    domains {
      _id
      domain
      status
      isGenerated
      portName
    }
    spec {
      source {
        dockerfile
      }
    }
    deployments {
      _id
      status
      createdAt
      startedAt
      finishedAt
    }
  }
}
`;

export const getServiceSchema = z.object({
  serviceId: z.string().describe("ID of the service to get"),
});

export type GetServiceInput = z.infer<typeof getServiceSchema>;

export async function getService(
  args: GetServiceInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(GET_SERVICE_QUERY, {
    id: args.serviceId,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}

// Create Service
const CREATE_SERVICE_MUTATION = `
mutation CreateService($name: String!, $projectID: ObjectID!) {
  createService(name: $name, template: PREBUILT_V2, projectID: $projectID) {
    _id
  }
}
`;

export const createServiceSchema = z.object({
  name: z.string().describe("Name of the service to create"),
  projectId: z.string().describe("ID of the project to create the service in"),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;

export async function createService(
  args: CreateServiceInput,
  context: ZeaburContext
): Promise<string> {
  const response = await context.graphql.query(CREATE_SERVICE_MUTATION, {
    name: args.name,
    projectID: args.projectId,
  });

  if (response.errors) {
    throw new Error(JSON.stringify(response.errors));
  }

  return JSON.stringify(response.data);
}
