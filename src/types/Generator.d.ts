import { IntrospectionNamedTypeRef } from "graphql/utilities";

export type GenerateCommandOptions = {
  outputFile: string;
  types: boolean;
  exportQueryFactoryAs: string;
  exportMutationFactoryAs: string;
  exportSubscriptionFactoryAs: string | boolean;
  queryFunction: string;
  mutateFunction: string;
  subscribeFunction: string;
  defineScalar?: string[];
};

export type ReturnTypeInfo = {
  name: string;
  type: string;
  notNull: boolean;
  isListOf: boolean;
  listNotNull: boolean;
  childKind: IntrospectionNamedTypeRef["kind"];
};
export type RootTypes = {
  query?: string;
  mutation?: string;
  subscription?: string;
};
