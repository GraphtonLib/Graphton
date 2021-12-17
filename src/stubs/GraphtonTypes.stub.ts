import type {AxiosResponse} from 'axios';

export type GraphQLServerEndpoint = string;
export type Headers = Record<string, string>;

export interface RequestOptions {
    headers?: Headers,
    url?: GraphQLServerEndpoint
}
export interface QueryResponse {
    data: Record<string, unknown>,
    response: AxiosResponse
}
export interface ReturnTypeInfo {
    type: string,
    notNull: boolean,
    isListOf: boolean,
    listNotNull?: boolean,
    kind: 'scalar'|'enum'|'object',
}
export type AvailableFieldBuilderConstructor<T> = {
    [Property in keyof T]: new() => T[Property]
}
export type QueryObjectFields<T> = {
    [Property in keyof T]?: T[Property]
}
