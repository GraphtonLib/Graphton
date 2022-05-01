import type { AxiosResponse } from "axios";
export declare type GraphQLServerEndpoint = string;
export declare type Headers = Record<string, string>;
export interface RequestOptions {
  headers?: Headers;
  url?: GraphQLServerEndpoint;
}
export interface QueryResponse {
  [key: string]: unknown;
  data: Record<string, unknown>;
  extensions?: Record<string, unknown>;
  errors?: Record<string, unknown>[];
  response: AxiosResponse;
}
export interface ReturnTypeInfo {
  type: string;
  notNull: boolean;
  isListOf: boolean;
  listNotNull?: boolean;
  kind: "scalar" | "enum" | "object";
}
export declare type AvailableFieldBuilderConstructor<T> = {
  [Property in keyof T]: new () => T[Property];
};
export declare type QueryObjectFields<T> = {
  [Property in keyof T]?: T[Property];
};
