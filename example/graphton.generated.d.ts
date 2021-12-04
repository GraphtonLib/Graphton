export declare class GraphtonSettings {
    static setDefaultHeaders(headers: Record<string, string>): void;
    static setDefaultUrl(defaultUrl: string): void;
}
import { AxiosResponse } from "axios";
declare type GraphQLServerEndpoint = string;
declare type Headers = Record<string, string>;
interface RequestOptions {
    headers?: Headers;
    url?: GraphQLServerEndpoint;
}
interface QueryResponse {
    data: Record<string, any>;
    response: AxiosResponse;
}
declare type RootType = 'query' | 'mutation';
declare abstract class GraphtonBaseQuery {
    protected abstract queryName: string;
    protected abstract arguments: Record<string, any>;
    protected abstract rootType: RootType;
    protected abstract returnType: GraphtonBaseReturnTypeBuilder;
    /**
     * Function to build the required fields for that query
     */
    abstract returnFields(returnFieldsClosure: (r: GraphtonBaseReturnTypeBuilder) => void): this;
    /**
     * Transform builder to graphql query string
     */
    toQuery(): string;
    /**
     * Execute the query
     */
    protected execute(requestOptions?: RequestOptions): Promise<QueryResponse>;
}
declare abstract class GraphtonBaseReturnTypeBuilder {
    protected abstract availableSimpleFields: Set<string>;
    protected abstract availableObjectFields: Record<string, new () => GraphtonBaseReturnTypeBuilder>;
    protected querySimpleFields: Set<string>;
    protected queryObjectFields: Record<string, GraphtonBaseReturnTypeBuilder>;
    protected abstract typeName: string;
    /**
     * Select all known fields
     */
    all(): this;
    /**
     * Clear field selection
     */
    clear(): this;
    /**
     * Select fields
     */
    with(...fieldNames: (string | string[])[]): this;
    /**
     * Remove fields
     */
    without(...fieldNames: (string | string[])[]): this;
    /**
     * Alias for .all().without(...fieldNames)
     */
    except(...fieldNames: (string | string[])[]): this;
    /**
     * Alias for .clear().with(...fieldNames)
     */
    only(...fieldNames: (string | string[])[]): this;
    withRelated(relatedType: string, buildFields: (type: GraphtonBaseReturnTypeBuilder) => void): void;
    withoutRelated(relatedType: string): void;
    toReturnTypeString(): string;
}
export interface User {
    id?: number;
    name?: string;
    age?: number | null;
    posts?: Post[];
}
export interface Post {
    id?: number;
    author?: User;
    text?: string;
}
declare type UserReturnTypeSimpleField = "id" | "name" | "age";
declare type UserReturnTypeObjectField = "posts";
declare class UserReturnTypeBuilder extends GraphtonBaseReturnTypeBuilder {
    protected availableSimpleFields: Set<string>;
    protected availableObjectFields: {
        posts: typeof PostReturnTypeBuilder;
    };
    protected typeName: string;
    with(...fieldNames: (UserReturnTypeSimpleField | UserReturnTypeSimpleField[])[]): this;
    without(...fieldNames: (UserReturnTypeSimpleField | UserReturnTypeSimpleField[])[]): this;
    except(...fieldNames: (UserReturnTypeSimpleField | UserReturnTypeSimpleField[])[]): this;
    only(...fieldNames: (UserReturnTypeSimpleField | UserReturnTypeSimpleField[])[]): this;
    withRelated(relatedType: UserReturnTypeObjectField, buildFields: (type: GraphtonBaseReturnTypeBuilder) => void): void;
    withoutRelated(relatedType: UserReturnTypeObjectField): void;
}
declare type PostReturnTypeSimpleField = "id" | "text";
declare type PostReturnTypeObjectField = "author";
declare class PostReturnTypeBuilder extends GraphtonBaseReturnTypeBuilder {
    protected availableSimpleFields: Set<string>;
    protected availableObjectFields: {
        author: typeof UserReturnTypeBuilder;
    };
    protected typeName: string;
    with(...fieldNames: (PostReturnTypeSimpleField | PostReturnTypeSimpleField[])[]): this;
    without(...fieldNames: (PostReturnTypeSimpleField | PostReturnTypeSimpleField[])[]): this;
    except(...fieldNames: (PostReturnTypeSimpleField | PostReturnTypeSimpleField[])[]): this;
    only(...fieldNames: (PostReturnTypeSimpleField | PostReturnTypeSimpleField[])[]): this;
    withRelated(relatedType: PostReturnTypeObjectField, buildFields: (type: GraphtonBaseReturnTypeBuilder) => void): void;
    withoutRelated(relatedType: PostReturnTypeObjectField): void;
}
declare class GraphtonQueryBuilderFactory {
    users(): UsersQuery;
    user(id?: number | null): UserQuery;
}
export declare const query: GraphtonQueryBuilderFactory;
interface UsersQueryResponse {
    data: {
        users: User[];
    };
    response: AxiosResponse;
}
declare class UsersQuery extends GraphtonBaseQuery {
    protected queryName: string;
    protected arguments: Record<string, any>;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
    constructor();
    returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this;
    get(requestOptions?: RequestOptions): Promise<UsersQueryResponse>;
    do(requestOptions?: RequestOptions): Promise<UsersQueryResponse>;
}
interface UserQueryResponse {
    data: {
        user?: User | null;
    };
    response: AxiosResponse;
}
declare class UserQuery extends GraphtonBaseQuery {
    protected queryName: string;
    protected arguments: Record<string, any>;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
    constructor(id?: number | null);
    returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this;
    get(requestOptions?: RequestOptions): Promise<UserQueryResponse>;
    do(requestOptions?: RequestOptions): Promise<UserQueryResponse>;
}
export {};
