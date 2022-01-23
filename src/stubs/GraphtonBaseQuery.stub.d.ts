import { GraphtonBaseReturnTypeBuilder } from './GraphtonBaseReturnTypeBuilder.stub';
import { QueryResponse, RequestOptions } from './GraphtonTypes.stub';
export declare type RootType = 'query' | 'mutation' | 'subscription' | '/*ROOTTYPE*/';
export declare abstract class GraphtonBaseQuery<T> {
    abstract readonly queryName: string;
    abstract readonly rootType: RootType;
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
