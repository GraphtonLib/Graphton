export declare class GraphtonSettings {
    static setDefaultHeaders(headers: Record<string, string>): void;
    static setDefaultUrl(defaultUrl: string): void;
}
import { AxiosResponse } from 'axios';
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
declare abstract class GraphtonBaseQuery<T extends Record<keyof T, number | string | boolean | null>> {
    protected abstract queryName: string;
    protected queryArgs: Record<string, number | string | boolean | null>;
    protected abstract rootType: RootType;
    protected abstract returnType: GraphtonBaseReturnTypeBuilder<any, any> | null;
    constructor(queryArgs?: T);
    /**
     * Transform builder to graphql query string
     */
    toQuery(): string;
    /**
     * Execute the query
     */
    protected execute(requestOptions?: RequestOptions): Promise<QueryResponse>;
}
declare type AvailableFieldBuilderConstructor<T> = {
    [Property in keyof T]: new () => T[Property];
};
declare type QueryObjectFields<T> = {
    [Property in keyof T]?: T[Property];
};
declare abstract class GraphtonBaseReturnTypeBuilder<ObjectField extends Record<keyof ObjectField, GraphtonBaseReturnTypeBuilder<any, any>>, SimpleField> {
    protected abstract availableSimpleFields: Set<SimpleField>;
    protected querySimpleFields: Set<SimpleField>;
    protected queryObjectFields: QueryObjectFields<ObjectField>;
    protected abstract queryObjectFieldBuilders: AvailableFieldBuilderConstructor<ObjectField>;
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
    with(...fieldNames: SimpleField[]): this;
    /**
     * Remove `...fieldNames` from selection
     */
    without(...fieldNames: SimpleField[]): this;
    /**
     * Alias for .all().without(...fieldNames)
     */
    except(...fieldNames: SimpleField[]): this;
    /**
     * Alias for .clear().with(...fieldNames)
     */
    only(...fieldNames: SimpleField[]): this;
    /**
     * Add the `relatedType` OBJECT field, selecting the fields for that type using the `buildFields` closure
     */
    withRelated<ObjectFieldName extends keyof ObjectField>(relatedType: ObjectFieldName, buildFields: (r: ObjectField[ObjectFieldName]) => void): this;
    /**
     * Remove the `relatedType` OBJECT field
     * Selected fields for `relatedType` will be removed!
     */
    withoutRelated<ObjectFieldName extends keyof ObjectField>(relatedType: ObjectFieldName): this;
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
    friends?: User[];
}
export interface Post {
    id?: number;
    author?: User;
    text?: string;
    repatedPosts?: Post[];
}
interface UserReturnTypeBuilderObjectBuilder {
    'posts': PostReturnTypeBuilder;
    'friends': UserReturnTypeBuilder;
}
declare type UserReturnTypeSimpleField = 'id' | 'name' | 'age';
declare class UserReturnTypeBuilder extends GraphtonBaseReturnTypeBuilder<UserReturnTypeBuilderObjectBuilder, UserReturnTypeSimpleField> {
    protected availableSimpleFields: Set<UserReturnTypeSimpleField>;
    protected typeName: string;
    protected queryObjectFieldBuilders: {
        posts: typeof PostReturnTypeBuilder;
        friends: typeof UserReturnTypeBuilder;
    };
}
interface PostReturnTypeBuilderObjectBuilder {
    'author': UserReturnTypeBuilder;
    'repatedPosts': PostReturnTypeBuilder;
}
declare type PostReturnTypeSimpleField = 'id' | 'text';
declare class PostReturnTypeBuilder extends GraphtonBaseReturnTypeBuilder<PostReturnTypeBuilderObjectBuilder, PostReturnTypeSimpleField> {
    protected availableSimpleFields: Set<PostReturnTypeSimpleField>;
    protected typeName: string;
    protected queryObjectFieldBuilders: {
        author: typeof UserReturnTypeBuilder;
        repatedPosts: typeof PostReturnTypeBuilder;
    };
}
export declare class Query {
    static users(queryArgs?: UsersQueryArguments): UsersQuery;
    static user(queryArgs?: UserQueryArguments): UserQuery;
    static userExists(queryArgs?: UserExistsQueryArguments): UserExistsQuery;
}
interface UsersQueryResponse {
    data: {
        users: User[];
    };
    response: AxiosResponse;
}
interface UsersQueryArguments {
}
declare class UsersQuery extends GraphtonBaseQuery<UsersQueryArguments> {
    protected queryName: string;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
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
interface UserQueryArguments {
    id: number;
}
declare class UserQuery extends GraphtonBaseQuery<UserQueryArguments> {
    protected queryName: string;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
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
interface UserExistsQueryArguments {
    id: number;
}
declare class UserExistsQuery extends GraphtonBaseQuery<UserExistsQueryArguments> {
    protected queryName: string;
    protected rootType: RootType;
    protected returnType: null;
    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    get(requestOptions?: RequestOptions): Promise<UserExistsQueryResponse>;
}
export declare class Mutation {
    static createUser(queryArgs: CreateUserMutationArguments): CreateUserMutation;
    static updateUser(queryArgs: UpdateUserMutationArguments): UpdateUserMutation;
    static deleteUser(queryArgs: DeleteUserMutationArguments): DeleteUserMutation;
}
interface CreateUserMutationResponse {
    data: {
        createUser: User;
    };
    response: AxiosResponse;
}
interface CreateUserMutationArguments {
    name: string;
    age?: (number | null);
}
declare class CreateUserMutation extends GraphtonBaseQuery<CreateUserMutationArguments> {
    protected queryName: string;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
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
interface UpdateUserMutationArguments {
    id: number;
    name?: (string | null);
    age?: (number | null);
}
declare class UpdateUserMutation extends GraphtonBaseQuery<UpdateUserMutationArguments> {
    protected queryName: string;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
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
interface DeleteUserMutationArguments {
    id: number;
}
declare class DeleteUserMutation extends GraphtonBaseQuery<DeleteUserMutationArguments> {
    protected queryName: string;
    protected rootType: RootType;
    protected returnType: UserReturnTypeBuilder;
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
