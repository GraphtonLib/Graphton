// FILE GENERATED BY GRAPHTON
// DO NOT EDIT - CHANGES WILL BE OVERWRITTEN
// REGION: Base classes
const settings = {
    defaultHeaders: {},
    defaultUrl: ''
};
export class GraphtonSettings {
    static setDefaultHeaders(headers) {
        settings.defaultHeaders = headers;
    }
    static setDefaultUrl(defaultUrl) {
        settings.defaultUrl = defaultUrl;
    }
}
import axios from "axios";
class GraphtonBaseQuery {
    /**
     * Transform builder to graphql query string
     */
    toQuery() {
        const queryArgs = Object.entries(this.arguments);
        let queryArgString = '';
        if (queryArgs.length > 0) {
            let queryArgItems = [];
            for (const [name, value] of queryArgs) {
                queryArgItems.push(`${name}: ${JSON.stringify(value)}`);
            }
            queryArgString = `(${queryArgItems.join(', ')})`;
        }
        return `${this.rootType} ${this.queryName} { ${this.queryName}${queryArgString} { ${this.returnType.toReturnTypeString()} } }`;
    }
    /**
     * Execute the query
     */
    async execute(requestOptions = {}) {
        let response = await axios.post(requestOptions?.url || settings.defaultUrl, { query: this.toQuery() }, {
            headers: {
                "Content-Type": "application/json",
                ...settings.defaultHeaders,
                ...requestOptions?.headers
            },
        });
        return {
            data: response.data.data,
            response
        };
    }
}
class GraphtonBaseReturnTypeBuilder {
    querySimpleFields = new Set([]);
    queryObjectFields = {};
    /**
     * Select all known fields te be returned
     */
    all() {
        this.querySimpleFields = new Set(this.availableSimpleFields);
        return this;
    }
    /**
     * Clear all selected fields.
     */
    clear() {
        this.querySimpleFields.clear();
        return this;
    }
    /**
     * Select `...fieldNames` to be returned
     */
    with(...fieldNames) {
        const flatFieldNames = fieldNames.flat();
        for (const fieldName of flatFieldNames) {
            if (!this.availableSimpleFields.has(fieldName)) {
                console.warn(`Field "${fieldName}" might not exist in type "${this.typeName}"!`);
            }
            this.querySimpleFields.add(fieldName);
        }
        return this;
    }
    /**
     * Remove `...fieldNames` from selection
     */
    without(...fieldNames) {
        const flatFieldNames = fieldNames.flat();
        for (const fieldName of flatFieldNames) {
            this.querySimpleFields.delete(fieldName);
        }
        return this;
    }
    /**
     * Alias for .all().without(...fieldNames)
     */
    except(...fieldNames) {
        return this.all().without(...fieldNames);
    }
    /**
     * Alias for .clear().with(...fieldNames)
     */
    only(...fieldNames) {
        return this.clear().with(...fieldNames);
    }
    /**
     * Add the `relatedType` OBJECT field, selecting the fields for that type using the `buildFields` closure
     */
    withRelated(relatedType, buildFields) {
        const relatedReturnTypeClass = this.availableObjectFields[relatedType];
        if (!relatedReturnTypeClass) {
            console.warn(`Trying to add related field ${relatedType} to type ${this.typeName} which does not exist. Ignoring!`);
            return;
        }
        const relatedReturnType = new relatedReturnTypeClass();
        buildFields(relatedReturnType);
        this.queryObjectFields[relatedType] = relatedReturnType;
    }
    /**
     * Remove the `relatedType` OBJECT field
     * Selected fields for `relatedType` will be removed!
     */
    withoutRelated(relatedType) {
        delete this.queryObjectFields[relatedType];
    }
    /**
     * Compile the selected fields to a GraphQL selection.
     */
    toReturnTypeString() {
        if (this.querySimpleFields.size < 1 && Object.values(this.queryObjectFields).length < 1) {
            return ``;
        }
        let returnTypeString = ['{', ...this.querySimpleFields];
        for (const [objectType, objectField] of Object.entries(this.queryObjectFields)) {
            let objectFieldReturnTypeString = objectField.toReturnTypeString();
            if (objectFieldReturnTypeString.length > 0) {
                returnTypeString.push(objectType, objectFieldReturnTypeString);
            }
        }
        returnTypeString.push('}');
        return returnTypeString.join(' ');
    }
}
class UserReturnTypeBuilder extends GraphtonBaseReturnTypeBuilder {
    availableSimpleFields = new Set(["id", "name", "age"]);
    availableObjectFields = { "posts": PostReturnTypeBuilder };
    typeName = 'User';
    with(...fieldNames) {
        return super.with(...fieldNames);
    }
    without(...fieldNames) {
        return super.without(...fieldNames);
    }
    except(...fieldNames) {
        return super.except(...fieldNames);
    }
    only(...fieldNames) {
        return super.only(...fieldNames);
    }
    withRelated(relatedType, buildFields) {
        return super.withRelated(relatedType, buildFields);
    }
    withoutRelated(relatedType) {
        return super.withoutRelated(relatedType);
    }
}
class PostReturnTypeBuilder extends GraphtonBaseReturnTypeBuilder {
    availableSimpleFields = new Set(["id", "text"]);
    availableObjectFields = { "author": UserReturnTypeBuilder };
    typeName = 'Post';
    with(...fieldNames) {
        return super.with(...fieldNames);
    }
    without(...fieldNames) {
        return super.without(...fieldNames);
    }
    except(...fieldNames) {
        return super.except(...fieldNames);
    }
    only(...fieldNames) {
        return super.only(...fieldNames);
    }
    withRelated(relatedType, buildFields) {
        return super.withRelated(relatedType, buildFields);
    }
    withoutRelated(relatedType) {
        return super.withoutRelated(relatedType);
    }
}
// REGION: Queries
export class Query {
    static users() {
        return new UsersQuery();
    }
    static user(id) {
        return new UserQuery(id);
    }
}
class UsersQuery extends GraphtonBaseQuery {
    queryName = "users";
    arguments = {};
    rootType = "query";
    returnType = new UserReturnTypeBuilder();
    constructor() {
        super();
        this.arguments = {};
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }
    returnFields(returnFieldsClosure) {
        returnFieldsClosure(this.returnType);
        return this;
    }
    async get(requestOptions = {}) {
        return (await super.execute());
    }
    async do(requestOptions = {}) {
        return (await super.execute());
    }
}
class UserQuery extends GraphtonBaseQuery {
    queryName = "user";
    arguments = {};
    rootType = "query";
    returnType = new UserReturnTypeBuilder();
    constructor(id) {
        super();
        this.arguments = { id };
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }
    returnFields(returnFieldsClosure) {
        returnFieldsClosure(this.returnType);
        return this;
    }
    async get(requestOptions = {}) {
        return (await super.execute());
    }
    async do(requestOptions = {}) {
        return (await super.execute());
    }
}
// REGION: Mutations
export class Mutation {
    static createUser(name, age) {
        return new CreateUserMutation(name, age);
    }
    static updateUser(id, name, age) {
        return new UpdateUserMutation(id, name, age);
    }
    static deleteUser(id) {
        return new DeleteUserMutation(id);
    }
}
class CreateUserMutation extends GraphtonBaseQuery {
    queryName = "createUser";
    arguments = {};
    rootType = "mutation";
    returnType = new UserReturnTypeBuilder();
    constructor(name, age) {
        super();
        this.arguments = { name, age };
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }
    returnFields(returnFieldsClosure) {
        returnFieldsClosure(this.returnType);
        return this;
    }
    async get(requestOptions = {}) {
        return (await super.execute());
    }
    async do(requestOptions = {}) {
        return (await super.execute());
    }
}
class UpdateUserMutation extends GraphtonBaseQuery {
    queryName = "updateUser";
    arguments = {};
    rootType = "mutation";
    returnType = new UserReturnTypeBuilder();
    constructor(id, name, age) {
        super();
        this.arguments = { id, name, age };
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }
    returnFields(returnFieldsClosure) {
        returnFieldsClosure(this.returnType);
        return this;
    }
    async get(requestOptions = {}) {
        return (await super.execute());
    }
    async do(requestOptions = {}) {
        return (await super.execute());
    }
}
class DeleteUserMutation extends GraphtonBaseQuery {
    queryName = "deleteUser";
    arguments = {};
    rootType = "mutation";
    returnType = new UserReturnTypeBuilder();
    constructor(id) {
        super();
        this.arguments = { id };
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }
    returnFields(returnFieldsClosure) {
        returnFieldsClosure(this.returnType);
        return this;
    }
    async get(requestOptions = {}) {
        return (await super.execute());
    }
    async do(requestOptions = {}) {
        return (await super.execute());
    }
}
