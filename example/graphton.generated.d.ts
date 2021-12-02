export interface User {
    id?: number;
    name?: string;
    age?: number | null;
}
export declare const grapthtonSettings: {
    setDefaultHeaders(headers: Record<string, string>): void;
    setDefaultUrl(defaultUrl: string): void;
};
import { AxiosResponse } from "axios";
declare type GraphQLServerEndpoint = string;
declare type Headers = Record<string, string>;
interface RequestOptions {
    headers?: Headers;
    url?: GraphQLServerEndpoint;
}
declare abstract class GraphtonBaseQuery {
    protected availableFields: Set<string>;
    protected queryName: string;
    protected queryFields: Set<string>;
    protected arguments: Record<string, any>;
    protected rootType: 'query' | 'mutation' | '';
    /**
     * Add all known fields.
     */
    allFields(): this;
    /**
     * Remove all fields.
     */
    clearFields(): this;
    /**
     * Add multiple fields to the query.
     */
    withFields(...fieldNames: (string | string[])[]): this;
    /**
     * Add a field to the query.
     */
    withField(fieldName: string): this;
    /**
     * Remove multiple fields from the query.
     */
    withoutFields(...fieldNames: (string | string[])[]): this;
    /**
     * Remove a field from the query.
     */
    withoutField(fieldName: string): this;
    /**
     * All of the fields, except these.
     */
    except(...fieldNames: (string | string[])[]): this;
    /**
     * Only the following fields, ignoring previously set fields.
     */
    only(...fieldNames: (string | string[])[]): this;
    /**
     * Transform builder to graphql query string
     */
    toQuery(): string;
    /**
     * Execute the query
     */
    protected execute(requestOptions?: RequestOptions): Promise<{
        data: any;
        response: AxiosResponse<any, any>;
    }>;
}
declare class GraphtonQueryBuilderFactory {
    static users(): UsersQuery;
    static user(id?: number | null): UserQuery;
}
export declare const query: GraphtonQueryBuilderFactory;
declare type UsersQueryAvailableFields = "id" | "name" | "age";
interface UsersQueryResponse {
    data: User[];
    response: AxiosResponse;
}
declare class UsersQuery extends GraphtonBaseQuery {
    protected availableFields: Set<string>;
    protected queryName: string;
    protected queryFields: Set<string>;
    protected arguments: Record<string, any>;
    protected rootType: 'query' | 'mutation';
    constructor();
    withFields(...fieldNames: (UsersQueryAvailableFields | UsersQueryAvailableFields[])[]): this;
    withField(fieldName: UsersQueryAvailableFields): this;
    withoutFields(...fieldNames: (UsersQueryAvailableFields | UsersQueryAvailableFields[])[]): this;
    withoutField(fieldName: UsersQueryAvailableFields): this;
    except(...fieldNames: (UsersQueryAvailableFields | UsersQueryAvailableFields[])[]): this;
    only(...fieldNames: (UsersQueryAvailableFields | UsersQueryAvailableFields[])[]): this;
    get(requestOptions?: RequestOptions): Promise<UsersQueryResponse>;
}
declare type UserQueryAvailableFields = "id" | "name" | "age";
interface UserQueryResponse {
    data?: User | null;
    response: AxiosResponse;
}
declare class UserQuery extends GraphtonBaseQuery {
    protected availableFields: Set<string>;
    protected queryName: string;
    protected queryFields: Set<string>;
    protected arguments: Record<string, any>;
    protected rootType: 'query' | 'mutation';
    constructor(id?: number | null);
    withFields(...fieldNames: (UserQueryAvailableFields | UserQueryAvailableFields[])[]): this;
    withField(fieldName: UserQueryAvailableFields): this;
    withoutFields(...fieldNames: (UserQueryAvailableFields | UserQueryAvailableFields[])[]): this;
    withoutField(fieldName: UserQueryAvailableFields): this;
    except(...fieldNames: (UserQueryAvailableFields | UserQueryAvailableFields[])[]): this;
    only(...fieldNames: (UserQueryAvailableFields | UserQueryAvailableFields[])[]): this;
    get(requestOptions?: RequestOptions): Promise<UserQueryResponse>;
}
declare class GraphtonMutationBuilderFactory {
    static createUser(name: string, age?: number | null): CreateUserMutation;
    static updateUser(id: number, name?: string | null, age?: number | null): UpdateUserMutation;
    static deleteUser(id: number): DeleteUserMutation;
}
export declare const mutation: GraphtonMutationBuilderFactory;
declare type CreateUserMutationAvailableFields = "id" | "name" | "age";
interface CreateUserMutationResponse {
    data: User;
    response: AxiosResponse;
}
declare class CreateUserMutation extends GraphtonBaseQuery {
    protected availableFields: Set<string>;
    protected queryName: string;
    protected queryFields: Set<string>;
    protected arguments: Record<string, any>;
    protected rootType: 'query' | 'mutation';
    constructor(name: string, age?: number | null);
    withFields(...fieldNames: (CreateUserMutationAvailableFields | CreateUserMutationAvailableFields[])[]): this;
    withField(fieldName: CreateUserMutationAvailableFields): this;
    withoutFields(...fieldNames: (CreateUserMutationAvailableFields | CreateUserMutationAvailableFields[])[]): this;
    withoutField(fieldName: CreateUserMutationAvailableFields): this;
    except(...fieldNames: (CreateUserMutationAvailableFields | CreateUserMutationAvailableFields[])[]): this;
    only(...fieldNames: (CreateUserMutationAvailableFields | CreateUserMutationAvailableFields[])[]): this;
    do(requestOptions?: RequestOptions): Promise<CreateUserMutationResponse>;
}
declare type UpdateUserMutationAvailableFields = "id" | "name" | "age";
interface UpdateUserMutationResponse {
    data: User;
    response: AxiosResponse;
}
declare class UpdateUserMutation extends GraphtonBaseQuery {
    protected availableFields: Set<string>;
    protected queryName: string;
    protected queryFields: Set<string>;
    protected arguments: Record<string, any>;
    protected rootType: 'query' | 'mutation';
    constructor(id: number, name?: string | null, age?: number | null);
    withFields(...fieldNames: (UpdateUserMutationAvailableFields | UpdateUserMutationAvailableFields[])[]): this;
    withField(fieldName: UpdateUserMutationAvailableFields): this;
    withoutFields(...fieldNames: (UpdateUserMutationAvailableFields | UpdateUserMutationAvailableFields[])[]): this;
    withoutField(fieldName: UpdateUserMutationAvailableFields): this;
    except(...fieldNames: (UpdateUserMutationAvailableFields | UpdateUserMutationAvailableFields[])[]): this;
    only(...fieldNames: (UpdateUserMutationAvailableFields | UpdateUserMutationAvailableFields[])[]): this;
    do(requestOptions?: RequestOptions): Promise<UpdateUserMutationResponse>;
}
declare type DeleteUserMutationAvailableFields = "id" | "name" | "age";
interface DeleteUserMutationResponse {
    data: User;
    response: AxiosResponse;
}
declare class DeleteUserMutation extends GraphtonBaseQuery {
    protected availableFields: Set<string>;
    protected queryName: string;
    protected queryFields: Set<string>;
    protected arguments: Record<string, any>;
    protected rootType: 'query' | 'mutation';
    constructor(id: number);
    withFields(...fieldNames: (DeleteUserMutationAvailableFields | DeleteUserMutationAvailableFields[])[]): this;
    withField(fieldName: DeleteUserMutationAvailableFields): this;
    withoutFields(...fieldNames: (DeleteUserMutationAvailableFields | DeleteUserMutationAvailableFields[])[]): this;
    withoutField(fieldName: DeleteUserMutationAvailableFields): this;
    except(...fieldNames: (DeleteUserMutationAvailableFields | DeleteUserMutationAvailableFields[])[]): this;
    only(...fieldNames: (DeleteUserMutationAvailableFields | DeleteUserMutationAvailableFields[])[]): this;
    do(requestOptions?: RequestOptions): Promise<DeleteUserMutationResponse>;
}
export {};
