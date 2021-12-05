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
    protected abstract returnType: GraphtonBaseReturnTypeBuilder | null;
    private toReturnTypeString;
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
     * Select all known fields te be returned
     */
    all(): this;
    /**
     * Clear all selected fields.
     */
    clear(): this;
    /**
     * Select `...fieldNames` to be returned
     */
    with(...fieldNames: (string | string[])[]): this;
    /**
     * Remove `...fieldNames` from selection
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
    /**
     * Add the `relatedType` OBJECT field, selecting the fields for that type using the `buildFields` closure
     */
    withRelated(relatedType: string, buildFields: (r: GraphtonBaseReturnTypeBuilder) => void): void;
    /**
     * Remove the `relatedType` OBJECT field
     * Selected fields for `relatedType` will be removed!
     */
    withoutRelated(relatedType: string): void;
    /**
     * Compile the selected fields to a GraphQL selection.
     */
    toReturnTypeString(): string;
}
export interface User {
    id?: number;
    name?: string;
    age?: (number | null);
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
export declare class Query {
    static users(): UsersQuery;
    static user(id?: (number | null)): UserQuery;
    static userExists(id?: (number | null)): UserExistsQuery;
}
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
    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this;
    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    get(requestOptions?: RequestOptions): Promise<UsersQueryResponse>;
}
interface UserQueryResponse {
    data: {
        user?: (User | null);
    };
    response: AxiosResponse;
}
declare class UserQuery extends GraphtonBaseQuery {
    protected queryName: string;
    protected arguments: Record<string, any>;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
    constructor(id?: (number | null));
    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this;
    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    get(requestOptions?: RequestOptions): Promise<UserQueryResponse>;
}
interface UserExistsQueryResponse {
    data: {
        userExists: boolean;
    };
    response: AxiosResponse;
}
declare class UserExistsQuery extends GraphtonBaseQuery {
    protected queryName: string;
    protected arguments: Record<string, any>;
    protected rootType: RootType;
    protected returnType: null;
    constructor(id?: (number | null));
    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    get(requestOptions?: RequestOptions): Promise<UserExistsQueryResponse>;
}
export declare class Mutation {
    static createUser(name: string, age?: (number | null)): CreateUserMutation;
    static updateUser(id: number, name?: (string | null), age?: (number | null)): UpdateUserMutation;
    static deleteUser(id: number): DeleteUserMutation;
}
interface CreateUserMutationResponse {
    data: {
        createUser: User;
    };
    response: AxiosResponse;
}
declare class CreateUserMutation extends GraphtonBaseQuery {
    protected queryName: string;
    protected arguments: Record<string, any>;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
    constructor(name: string, age?: (number | null));
    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this;
    /**
     * Do the mutation on the server
     * Only available on Mutation type requests
     */
    do(requestOptions?: RequestOptions): Promise<CreateUserMutationResponse>;
}
interface UpdateUserMutationResponse {
    data: {
        updateUser: User;
    };
    response: AxiosResponse;
}
declare class UpdateUserMutation extends GraphtonBaseQuery {
    protected queryName: string;
    protected arguments: Record<string, any>;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
    constructor(id: number, name?: (string | null), age?: (number | null));
    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this;
    /**
     * Do the mutation on the server
     * Only available on Mutation type requests
     */
    do(requestOptions?: RequestOptions): Promise<UpdateUserMutationResponse>;
}
interface DeleteUserMutationResponse {
    data: {
        deleteUser: User;
    };
    response: AxiosResponse;
}
declare class DeleteUserMutation extends GraphtonBaseQuery {
    protected queryName: string;
    protected arguments: Record<string, any>;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
    constructor(id: number);
    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this;
    /**
     * Do the mutation on the server
     * Only available on Mutation type requests
     */
    do(requestOptions?: RequestOptions): Promise<DeleteUserMutationResponse>;
}
export {};
