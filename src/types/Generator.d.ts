export interface GenerateCommandOptions {
  outputFile: string;
  types: boolean;
  exportQueryFactoryAs: string;
  exportMutationFactoryAs: string;
  exportSubscriptionFactoryAs: string | boolean;
  queryFunction: string;
  mutateFunction: string;
  subscribeFunction: string;
  defineScalar?: string[];
}

export interface ReturnTypeInfo {
  type: string;
  notNull: boolean;
  isListOf: boolean;
  listNotNull?: boolean;
  kind: "scalar" | "enum" | "object";
}
