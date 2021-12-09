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
declare type QueryArgs<T> = {
    [Property in keyof T]: string | boolean | number | null | undefined;
};
export declare type RootType = 'query' | 'mutation' | '/*ROOTTYPE*/';
export declare abstract class GraphtonBaseQuery<QueryArgumentType extends QueryArgs<QueryArgumentType>> {
    protected abstract queryName: string;
    protected queryArgs: Partial<NonNullable<QueryArgumentType>>;
    protected abstract rootType: RootType;
    protected abstract returnType: GraphtonBaseReturnTypeBuilder<any, any> | null;
    setArgs(queryArgs: Partial<QueryArgumentType>): void;
    /**
     * Transform builder to graphql query string
     */
    toQuery(): string;
    /**
     * Execute the query
     */
    protected execute(requestOptions?: RequestOptions): Promise<QueryResponse>;
}
export {};
