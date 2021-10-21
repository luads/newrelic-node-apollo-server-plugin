import type { ApolloServerPlugin } from "apollo-server-plugin-base";

export type NRPluginConfig = {
  captureScalars?: boolean;
  captureIntrospectionQueries?: boolean;
  captureServiceDefinitionQueries?: boolean;
  captureHealthCheckQueries?: boolean;
  ignoredStatusCodes?: number[]
};

declare let NRApolloPlugin: ApolloServerPlugin;

export function createPlugin(config: NRPluginConfig): ApolloServerPlugin;

export default NRApolloPlugin;
