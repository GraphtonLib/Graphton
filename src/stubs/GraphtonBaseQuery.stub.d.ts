import { GraphtonBaseReturnTypeBuilder } from './GraphtonBaseReturnTypeBuilder.stub';
import { AxiosResponse } from 'axios';
declare type GraphQLServerEndpoint = string;
declare type Headers = Record<string, string>;
interface RequestOptions {
    headers?: Headers;
    url?: GraphQLServerEndpoint;
}
interface QueryResponse {
    data: Record<string, unknown>;
    response: AxiosResponse;
}
export declare class GraphtonEnum<T extends string> {
    readonly enumValue: T;
    constructor(enumValue: T);
}
export declare type RootType = 'query' | 'mutation' | '/*ROOTTYPE*/';
export declare abstract class GraphtonBaseQuery<T> {
    protected abstract queryName: string;
    protected abstract rootType: RootType;
    protected abstract returnType: GraphtonBaseReturnTypeBuilder<any, any> | null;
    abstract setArgs(queryArgs: Partial<T>): void;
    protected abstract toArgString(): string;
    /**
     * Transform builder to graphql query string
     */
    toQuery(): string;
    protected argify(argValue: unknown): string;
    /**
     * Execute the query
     */
    protected execute(requestOptions?: RequestOptions): Promise<QueryResponse>;
}
export {};
