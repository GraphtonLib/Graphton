/**
 * FILE GENERATED BY GRAPHTON
 * DO NOT EDIT - CHANGES WILL BE OVERWRITTEN
 * @see https://github.com/GraphtonLib/Graphton
 **/

// REGION: Base classes
const settings = {
    defaultHeaders: {},
    defaultUrl: ''
}

export class GraphtonSettings {
    public static setDefaultHeaders(headers: Record<string, string>): void {
        settings.defaultHeaders = headers;
    }

    public static setDefaultUrl(defaultUrl: string): void {
        settings.defaultUrl = defaultUrl;
    }
}

import axios, {AxiosResponse} from "axios";

type GraphQLServerEndpoint = string;
type Headers = Record<string, string>;

interface RequestOptions {
    headers?: Headers,
    url?: GraphQLServerEndpoint
}
interface QueryResponse {
    data: Record<string, unknown>,
    response: AxiosResponse
}
type QueryArgs<T> = {
    [Property in keyof T]: string|boolean|number|null|undefined;
}

 type RootType = 'query'|'mutation';

 abstract class GraphtonBaseQuery<QueryArgumentType extends QueryArgs<QueryArgumentType>> {
    protected abstract queryName: string;
    protected queryArgs: Partial<NonNullable<QueryArgumentType>> = {};
    protected abstract rootType: RootType;
    protected abstract returnType: GraphtonBaseReturnTypeBuilder<any, any> | null;

    public setArgs(queryArgs: Partial<QueryArgumentType>): void {
        const newArgs: Partial<NonNullable<QueryArgumentType>> = {};
        const mergedArgs: Partial<QueryArgumentType> = {...this.queryArgs, ...queryArgs};
        for(const key in mergedArgs) {
            if (this.queryArgs[key] !== undefined && this.queryArgs[key] !== null) {
                newArgs[key] = this.queryArgs[key];
            }
        }
    }

    /**
     * Transform builder to graphql query string
     */
    public toQuery(): string {
        const queryArgs = Object.entries(this.queryArgs);
        let queryArgString = '';
        if (queryArgs.length > 0) {
            const queryArgItems: string[] = [];
            for (const [name, value] of queryArgs) {
                queryArgItems.push(`${name}: ${JSON.stringify(value)}`);
            }

            queryArgString = `(${queryArgItems.join(', ')})`;
        }

        return `${this.rootType} ${this.queryName} { ${this.queryName}${queryArgString} ${this.returnType?.toReturnTypeString()||''} }`;
    }

    /**
     * Execute the query
     */
    protected async execute(requestOptions: RequestOptions = {}): Promise<QueryResponse> {
        const response = await axios.post(requestOptions?.url || settings.defaultUrl, {query: this.toQuery()}, {
            headers: {
                "Content-Type": "application/json",
                ...settings.defaultHeaders,
                ...requestOptions?.headers
            },
        });

        return {
            data: response.data.data,
            response
        }
    }
}

type AvailableFieldBuilderConstructor<T> = {
    [Property in keyof T]: new() => T[Property]
}
type QueryObjectFields<T> = {
    [Property in keyof T]?: T[Property]
}

abstract class GraphtonBaseReturnTypeBuilder<ObjectField extends Record<keyof ObjectField, GraphtonBaseReturnTypeBuilder<any,any>>, SimpleField> {
    protected abstract availableSimpleFields: Set<SimpleField>;
    protected querySimpleFields: Set<SimpleField> = new Set([]);
    protected queryObjectFields: QueryObjectFields<ObjectField> = {};
    protected abstract queryObjectFieldBuilders: AvailableFieldBuilderConstructor<ObjectField>;
    protected abstract typeName: string;

    /**
     * Select all known fields te be returned
     */
    public all(): this {
        this.querySimpleFields = new Set(this.availableSimpleFields);
        return this;
    }

    /**
     * Clear all selected fields.
     */
    public clear(): this {
        this.querySimpleFields.clear();
        return this;
    }

    /**
     * Select `...fieldNames` to be returned
     */
    public with(...fieldNames: SimpleField[]): this {
        for(const fieldName of fieldNames) {
            if(!this.availableSimpleFields.has(fieldName)) {
                console.warn(`Field "${fieldName}" might not exist in type "${this.typeName}"!`);
            }

            this.querySimpleFields.add(fieldName);
        }

        return this;
    }

    /**
     * Remove `...fieldNames` from selection
     */
    public without(...fieldNames: SimpleField[]): this {
        for(const fieldName of fieldNames) {
            this.querySimpleFields.delete(fieldName);
        }

        return this;
    }

    /**
     * Alias for .all().without(...fieldNames)
     */
    public except(...fieldNames: SimpleField[]): this {
        return this.all().without(...fieldNames);
    }

    /**
     * Alias for .clear().with(...fieldNames)
     */
    public only(...fieldNames: SimpleField[]): this {
        return this.clear().with(...fieldNames);
    }

    /**
     * Add the `relatedType` OBJECT field, selecting the fields for that type using the `buildFields` closure
     */
    public withRelated<ObjectFieldName extends keyof ObjectField>(relatedType: ObjectFieldName, buildFields: (r: ObjectField[ObjectFieldName]) => void): this {
        const relatedReturnType = new this.queryObjectFieldBuilders[relatedType]();
        buildFields(relatedReturnType);
        this.queryObjectFields[relatedType] = relatedReturnType;

        return this;
    }

    /**
     * Remove the `relatedType` OBJECT field
     * Selected fields for `relatedType` will be removed!
     */
    public withoutRelated<ObjectFieldName extends keyof ObjectField>(relatedType: ObjectFieldName): this {
        delete this.queryObjectFields[relatedType];

        return this;
    }

    /**
     * Compile the selected fields to a GraphQL selection.
     */
    public toReturnTypeString(): string {
        if(this.querySimpleFields.size < 1 && Object.values(this.queryObjectFields).length < 1) {
            return ``;
        }

        const returnTypeString = ['{', ...this.querySimpleFields];

        for(const [objectType, objectField] of Object.entries(this.queryObjectFields)) {
            const objectFieldReturnTypeString = (<GraphtonBaseReturnTypeBuilder<any,any>>objectField).toReturnTypeString();
            if(objectFieldReturnTypeString.length > 0) {
                returnTypeString.push(objectType, objectFieldReturnTypeString);
            }
        }

        returnTypeString.push('}');

        return returnTypeString.join(' ');
    }
}

// REGION: Types
export interface User {
  id?: number,
  name?: string,
  age?: (number | null),
  posts?: Post[],
  friends?: User[],
}
export interface Post {
  id?: number,
  author?: User,
  text?: string,
  repatedPosts?: Post[],
}

interface UserReturnTypeBuilderObjectBuilder {"posts":PostReturnTypeBuilder,"friends":UserReturnTypeBuilder}
type UserReturnTypeSimpleField = "id"|"name"|"age";

class UserReturnTypeBuilder extends GraphtonBaseReturnTypeBuilder<UserReturnTypeBuilderObjectBuilder, UserReturnTypeSimpleField> {
    protected availableSimpleFields: Set<UserReturnTypeSimpleField> = new Set(["id","name","age"]);
    protected typeName = 'User';
    protected queryObjectFieldBuilders = {"posts":PostReturnTypeBuilder,"friends":UserReturnTypeBuilder};
}

interface PostReturnTypeBuilderObjectBuilder {"author":UserReturnTypeBuilder,"repatedPosts":PostReturnTypeBuilder}
type PostReturnTypeSimpleField = "id"|"text";

class PostReturnTypeBuilder extends GraphtonBaseReturnTypeBuilder<PostReturnTypeBuilderObjectBuilder, PostReturnTypeSimpleField> {
    protected availableSimpleFields: Set<PostReturnTypeSimpleField> = new Set(["id","text"]);
    protected typeName = 'Post';
    protected queryObjectFieldBuilders = {"author":UserReturnTypeBuilder,"repatedPosts":PostReturnTypeBuilder};
}

// REGION: Queries
export class Query {
  public static users() {
    return new UsersQuery();
  }
  public static user(queryArgs?: UserQueryArguments) {
    return new UserQuery(queryArgs);
  }
  public static userExists(queryArgs?: UserExistsQueryArguments) {
    return new UserExistsQuery(queryArgs);
  }
}

interface UsersQueryResponse {
    data: {
        users: User[]
    };
    response: AxiosResponse;
}

class UsersQuery extends GraphtonBaseQuery<never> {
    protected queryName = "users";
    protected rootType: RootType = "query";
    protected returnType = new UserReturnTypeBuilder();

    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    public returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this {
        returnFieldsClosure(this.returnType);
        return this;
    }

    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    async get(requestOptions: RequestOptions = {}): Promise<UsersQueryResponse> {
        return <UsersQueryResponse>(await super.execute(requestOptions));
    }

}

interface UserQueryResponse {
    data: {
        user?: (User | null)
    };
    response: AxiosResponse;
}

interface UserQueryArguments {
    id: number;
}

class UserQuery extends GraphtonBaseQuery<UserQueryArguments> {
    protected queryName = "user";
    protected rootType: RootType = "query";
    protected returnType = new UserReturnTypeBuilder();

    constructor(queryArgs?: UserQueryArguments) {
        super();
        queryArgs && this.setArgs(queryArgs);
    }

    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    public returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this {
        returnFieldsClosure(this.returnType);
        return this;
    }

    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    async get(requestOptions: RequestOptions = {}): Promise<UserQueryResponse> {
        return <UserQueryResponse>(await super.execute(requestOptions));
    }

}

interface UserExistsQueryResponse {
    data: {
        userExists: boolean
    };
    response: AxiosResponse;
}

interface UserExistsQueryArguments {
    id: number;
}

class UserExistsQuery extends GraphtonBaseQuery<UserExistsQueryArguments> {
    protected queryName = "userExists";
    protected rootType: RootType = "query";
    protected returnType =  null;

    constructor(queryArgs?: UserExistsQueryArguments) {
        super();
        queryArgs && this.setArgs(queryArgs);
    }

    /**
     * Execute the query and get the results
     * Only available on Query type requests
     */
    async get(requestOptions: RequestOptions = {}): Promise<UserExistsQueryResponse> {
        return <UserExistsQueryResponse>(await super.execute(requestOptions));
    }

}

// REGION: Mutations
export class Mutation {
  public static createUser(queryArgs: CreateUserMutationArguments) {
    return new CreateUserMutation(queryArgs);
  }
  public static updateUser(queryArgs: UpdateUserMutationArguments) {
    return new UpdateUserMutation(queryArgs);
  }
  public static deleteUser(queryArgs: DeleteUserMutationArguments) {
    return new DeleteUserMutation(queryArgs);
  }
}

interface CreateUserMutationResponse {
    data: {
        createUser: User
    };
    response: AxiosResponse;
}

interface CreateUserMutationArguments {
    name: string;
    age?: (number | null);
}

class CreateUserMutation extends GraphtonBaseQuery<CreateUserMutationArguments> {
    protected queryName = "createUser";
    protected rootType: RootType = "mutation";
    protected returnType = new UserReturnTypeBuilder();

    constructor(queryArgs?: CreateUserMutationArguments) {
        super();
        queryArgs && this.setArgs(queryArgs);
    }

    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    public returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this {
        returnFieldsClosure(this.returnType);
        return this;
    }

    /**
     * Do the mutation on the server
     * Only available on Mutation type requests
     */
    async do(requestOptions: RequestOptions = {}): Promise<CreateUserMutationResponse> {
        return <CreateUserMutationResponse>(await super.execute(requestOptions));
    }

}

interface UpdateUserMutationResponse {
    data: {
        updateUser: User
    };
    response: AxiosResponse;
}

interface UpdateUserMutationArguments {
    id: number;
    name?: (string | null);
    age?: (number | null);
}

class UpdateUserMutation extends GraphtonBaseQuery<UpdateUserMutationArguments> {
    protected queryName = "updateUser";
    protected rootType: RootType = "mutation";
    protected returnType = new UserReturnTypeBuilder();

    constructor(queryArgs?: UpdateUserMutationArguments) {
        super();
        queryArgs && this.setArgs(queryArgs);
    }

    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    public returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this {
        returnFieldsClosure(this.returnType);
        return this;
    }

    /**
     * Do the mutation on the server
     * Only available on Mutation type requests
     */
    async do(requestOptions: RequestOptions = {}): Promise<UpdateUserMutationResponse> {
        return <UpdateUserMutationResponse>(await super.execute(requestOptions));
    }

}

interface DeleteUserMutationResponse {
    data: {
        deleteUser: User
    };
    response: AxiosResponse;
}

interface DeleteUserMutationArguments {
    id: number;
}

class DeleteUserMutation extends GraphtonBaseQuery<DeleteUserMutationArguments> {
    protected queryName = "deleteUser";
    protected rootType: RootType = "mutation";
    protected returnType = new UserReturnTypeBuilder();

    constructor(queryArgs?: DeleteUserMutationArguments) {
        super();
        queryArgs && this.setArgs(queryArgs);
    }

    /**
     * Function to build the required fields for that query
     * Only available if the return type is an OBJECT
     */
    public returnFields(returnFieldsClosure: (r: UserReturnTypeBuilder) => void): this {
        returnFieldsClosure(this.returnType);
        return this;
    }

    /**
     * Do the mutation on the server
     * Only available on Mutation type requests
     */
    async do(requestOptions: RequestOptions = {}): Promise<DeleteUserMutationResponse> {
        return <DeleteUserMutationResponse>(await super.execute(requestOptions));
    }

}