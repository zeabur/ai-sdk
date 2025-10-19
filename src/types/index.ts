export interface GraphQLClient {
  query<T = any>(query: string, variables?: Record<string, any>): Promise<{
    data: T;
    errors?: any[];
  }>;
  getUserInfo(): Promise<{
    data: {
      me: {
        _id: string;
        email: string;
      };
    };
  }>;
}

export interface Filesystem {
  list(path: string, limit: number, offset: number): Promise<string[]>;
  read(path: string): Promise<string>;
}

export interface ZeaburContext {
  graphql: GraphQLClient;
  filesystem?: Filesystem;
}

export interface DeployFromSpecificationInput {
  service_id: string;
  specification: DeployFromSpecificationSpecification;
}

export interface DeployFromSpecificationSpecification {
  source: {
    source?: "GITHUB" | "UPLOAD_ID";
    repoID?: number;
    branch?: string;
    uploadID?: string;
    image?: string;
    dockerfile?: string;
  };
  env?: {
    key: string;
    default: string;
    expose: boolean;
  }[];
}

export interface ExecuteCommandResult {
  exitCode: number;
  output: string;
}