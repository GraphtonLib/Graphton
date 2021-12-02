// FILE GENERATED BY GRAPHTON
// DO NOT EDIT - CHANGES WILL BE OVERWRITTEN
// REGION: Base classes
const settings = {
    defaultHeaders: {},
    defaultUrl: ''
};
export const grapthtonSettings = {
    setDefaultHeaders(headers) {
        settings.defaultHeaders = headers;
    },
    setDefaultUrl(defaultUrl) {
        settings.defaultUrl = defaultUrl;
    }
};
import axios from "axios";
class GraphtonBaseQuery {
    availableFields = new Set([]);
    queryName = '';
    queryFields = new Set([]);
    arguments = {};
    rootType = '';
    /**
     * Add all known fields.
     */
    allFields() {
        this.queryFields = new Set(this.availableFields);
        return this;
    }
    /**
     * Remove all fields.
     */
    clearFields() {
        this.queryFields.clear();
        return this;
    }
    /**
     * Add multiple fields to the query.
     */
    withFields(...fieldNames) {
        const flatFieldNames = fieldNames.flat();
        for (const fieldName of flatFieldNames) {
            if (!this.availableFields.has(fieldName)) {
                console.warn(`You are trying to query ${this.queryName} with a field named ${fieldName}, which might not exist!`);
            }
            this.queryFields.add(fieldName);
        }
        return this;
    }
    /**
     * Add a field to the query.
     */
    withField(fieldName) {
        return this.withFields(fieldName);
    }
    /**
     * Remove multiple fields from the query.
     */
    withoutFields(...fieldNames) {
        const flatFieldNames = fieldNames.flat();
        for (const fieldName of flatFieldNames) {
            this.queryFields.delete(fieldName);
        }
        return this;
    }
    /**
     * Remove a field from the query.
     */
    withoutField(fieldName) {
        return this.withoutFields(fieldName);
    }
    /**
     * All of the fields, except these.
     */
    except(...fieldNames) {
        return this.allFields().withoutFields(...fieldNames);
    }
    /**
     * Only the following fields, ignoring previously set fields.
     */
    only(...fieldNames) {
        return this.clearFields().withFields(...fieldNames);
    }
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
        return `${this.rootType} ${this.queryName} { ${this.queryName}${queryArgString} { ${[...this.queryFields].join(' ')} } }`;
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
// REGION: Queries
class GraphtonQueryBuilderFactory {
    static users() {
        return new UsersQuery();
    }
    static user(id) {
        return new UserQuery(id);
    }
}
export const query = new GraphtonQueryBuilderFactory();
class UsersQuery extends GraphtonBaseQuery {
    availableFields = new Set(["id", "name"]);
    queryName = 'users';
    // Builder essentials
    queryFields = new Set([]);
    arguments = {};
    rootType = 'query';
    constructor() {
        super();
        this.arguments = {};
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }
    withFields(...fieldNames) {
        return super.withFields(...fieldNames);
    }
    withField(fieldName) {
        return super.withField(fieldName);
    }
    withoutFields(...fieldNames) {
        return super.withoutFields(...fieldNames);
    }
    withoutField(fieldName) {
        return super.withoutField(fieldName);
    }
    except(...fieldNames) {
        return super.except(...fieldNames);
    }
    only(...fieldNames) {
        return super.only(...fieldNames);
    }
    async get(requestOptions = {}) {
        return (await super.execute());
    }
}
class UserQuery extends GraphtonBaseQuery {
    availableFields = new Set(["id", "name"]);
    queryName = 'user';
    // Builder essentials
    queryFields = new Set([]);
    arguments = {};
    rootType = 'query';
    constructor(id) {
        super();
        this.arguments = { id };
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }
    withFields(...fieldNames) {
        return super.withFields(...fieldNames);
    }
    withField(fieldName) {
        return super.withField(fieldName);
    }
    withoutFields(...fieldNames) {
        return super.withoutFields(...fieldNames);
    }
    withoutField(fieldName) {
        return super.withoutField(fieldName);
    }
    except(...fieldNames) {
        return super.except(...fieldNames);
    }
    only(...fieldNames) {
        return super.only(...fieldNames);
    }
    async get(requestOptions = {}) {
        return (await super.execute());
    }
}
// REGION: Mutations
class GraphtonMutationBuilderFactory {
    static createUser(name, pin) {
        return new CreateUserMutation(name, pin);
    }
    static updateUser(id, name, pin) {
        return new UpdateUserMutation(id, name, pin);
    }
    static deleteUser(id) {
        return new DeleteUserMutation(id);
    }
}
export const mutation = new GraphtonMutationBuilderFactory();
class CreateUserMutation extends GraphtonBaseQuery {
    availableFields = new Set(["id", "name"]);
    queryName = 'createUser';
    // Builder essentials
    queryFields = new Set([]);
    arguments = {};
    rootType = 'mutation';
    constructor(name, pin) {
        super();
        this.arguments = { name, pin };
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }
    withFields(...fieldNames) {
        return super.withFields(...fieldNames);
    }
    withField(fieldName) {
        return super.withField(fieldName);
    }
    withoutFields(...fieldNames) {
        return super.withoutFields(...fieldNames);
    }
    withoutField(fieldName) {
        return super.withoutField(fieldName);
    }
    except(...fieldNames) {
        return super.except(...fieldNames);
    }
    only(...fieldNames) {
        return super.only(...fieldNames);
    }
    async do(requestOptions = {}) {
        return (await super.execute());
    }
}
class UpdateUserMutation extends GraphtonBaseQuery {
    availableFields = new Set(["id", "name"]);
    queryName = 'updateUser';
    // Builder essentials
    queryFields = new Set([]);
    arguments = {};
    rootType = 'mutation';
    constructor(id, name, pin) {
        super();
        this.arguments = { id, name, pin };
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }
    withFields(...fieldNames) {
        return super.withFields(...fieldNames);
    }
    withField(fieldName) {
        return super.withField(fieldName);
    }
    withoutFields(...fieldNames) {
        return super.withoutFields(...fieldNames);
    }
    withoutField(fieldName) {
        return super.withoutField(fieldName);
    }
    except(...fieldNames) {
        return super.except(...fieldNames);
    }
    only(...fieldNames) {
        return super.only(...fieldNames);
    }
    async do(requestOptions = {}) {
        return (await super.execute());
    }
}
class DeleteUserMutation extends GraphtonBaseQuery {
    availableFields = new Set(["id", "name"]);
    queryName = 'deleteUser';
    // Builder essentials
    queryFields = new Set([]);
    arguments = {};
    rootType = 'mutation';
    constructor(id) {
        super();
        this.arguments = { id };
        Object.keys(this.arguments).forEach(key => this.arguments[key] === undefined && delete this.arguments[key]);
    }
    withFields(...fieldNames) {
        return super.withFields(...fieldNames);
    }
    withField(fieldName) {
        return super.withField(fieldName);
    }
    withoutFields(...fieldNames) {
        return super.withoutFields(...fieldNames);
    }
    withoutField(fieldName) {
        return super.withoutField(fieldName);
    }
    except(...fieldNames) {
        return super.except(...fieldNames);
    }
    only(...fieldNames) {
        return super.only(...fieldNames);
    }
    async do(requestOptions = {}) {
        return (await super.execute());
    }
}
