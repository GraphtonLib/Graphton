/**
 * FILE GENERATED BY GRAPHTON
 * DO NOT EDIT - CHANGES WILL BE OVERWRITTEN
 * @see https://github.com/GraphtonLib/Graphton
 **/
// REGION: Base classes
export class GraphtonSettings {
  static headers = {};
  static graphqlEndpoint = "";
}
import axios from "axios";
function applyMixins(derivedCtor, constructors) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null)
      );
    });
  });
}
export class GraphtonBaseQuery {
  constructor() {
    this.initGraphtonQueryReturnsObject();
  }
  initGraphtonQueryReturnsObject() {}
  /**
   * Get the return object format
   */
  toReturnString() {
    return "";
  }
  /**
   * Transform arguments to string to use in query
   */
  toArgString() {
    return "";
  }
  /**
   * Transform query class to graphql query string
   */
  toQuery() {
    return `${this.rootType} ${this.queryName} { ${this.queryName}${this.toArgString()} ${this.toReturnString()} }`;
  }
  /**
   * Execute the query
   */
  async execute(requestConfig = {}) {
    if (requestConfig.headers) {
      requestConfig.headers = {
        ...requestConfig.headers,
        "Content-Type": "application/json",
      };
    }
    const response = await axios.post(
      GraphtonSettings.graphqlEndpoint,
      { query: this.toQuery() },
      {
        headers: {
          "Content-Type": "application/json",
          ...GraphtonSettings.headers,
        },
        ...requestConfig,
      }
    );
    const returnData = {
      ...response.data,
      axiosResponse: response,
    };
    if (returnData.errors) {
      return Promise.reject(returnData);
    }
    return returnData;
  }
}
export class GraphtonQueryReturnsObject {
  selectedFields;
  returnType;
  initGraphtonQueryReturnsObject() {
    this.selectedFields = { root: {} };
  }
  /**
   * Select fields that should be returned
   */
  select(fields) {
    this.doSelect(fields, this.selectedFields.root);
    return this;
  }
  doSelect(fields, selectionLevel, lookupType = this.returnType) {
    for (let [field, subSelection] of Object.entries(fields)) {
      if (field === "_all") {
        Object.entries(fieldObjectMap[lookupType])
          .filter(([, v]) => v === null)
          .forEach(([k]) => (selectionLevel[k] = {}));
      } else {
        if (subSelection === undefined) continue;
        let lookupField = fieldObjectMap[lookupType][field];
        if (!selectionLevel[field]) selectionLevel[field] = {};
        if (Object.keys(subSelection).length > 0 && typeof lookupField === "string") {
          this.doSelect(subSelection, selectionLevel[field], lookupField);
        }
      }
    }
  }
  /**
   * Deselect fields that were returned.
   */
  deselect(fields) {
    this.doDeselect(fields, this.selectedFields);
    return this;
  }
  doDeselect(fields, selectionLevel, subLevel = "root") {
    for (let [field, subSelection] of Object.entries(fields)) {
      if (field === "_all") {
        delete selectionLevel[subLevel];
      } else {
        if (subSelection === undefined) continue;
        let selectionSubLevel = selectionLevel[subLevel];
        if (Object.keys(subSelection).length > 0) {
          this.doDeselect(subSelection, selectionSubLevel, field);
          if (Object.keys(selectionSubLevel).length < 1) {
            delete selectionSubLevel[field];
          }
        } else {
          delete selectionSubLevel[field];
        }
      }
    }
  }
  toReturnString() {
    return `{ ${this.toReturnStringPart(this.selectedFields.root)} }`;
  }
  toReturnStringPart(part) {
    let toReturn = [];
    for (let [field, subSelection] of Object.entries(part)) {
      if (!subSelection) continue;
      toReturn.push(field);
      if (Object.keys(subSelection).length > 0) {
        toReturn.push(`{ ${this.toReturnStringPart(subSelection)} }`);
      }
    }
    return toReturn.join(" ");
  }
}
export class GraphtonQueryHasArguments {
  queryArgs;
  /**
   * Set the arguments for this query
   */
  setArgs(queryArgs) {
    this.queryArgs = queryArgs;
    return this;
  }
  toArgString() {
    const queryArgItems = [];
    for (const [argKey, argValue] of Object.entries(this.queryArgs)) {
      try {
        queryArgItems.push(`${argKey}: ${this.argify(argValue)}`);
      } catch (e) {
        console.warn(e);
      }
    }
    if (queryArgItems.length > 0) {
      return `(${queryArgItems.join(", ")})`;
    }
    return "";
  }
  argify(argValue) {
    if (argValue instanceof GraphtonBaseEnum) {
      return `${argValue}`;
    }
    if (Array.isArray(argValue)) {
      return `[${argValue.map((v) => this.argify(v))}]`;
    }
    if (typeof argValue === "object" && !Array.isArray(argValue) && argValue !== null) {
      const decoded = [];
      for (const [key, value] of Object.entries(argValue)) {
        decoded.push(`${key}: ${this.argify(value)}`);
      }
      return `{${decoded.join(",")}}`;
    }
    if (
      typeof argValue === "string" ||
      typeof argValue === "number" ||
      typeof argValue === "boolean" ||
      argValue === null
    ) {
      return JSON.stringify(argValue);
    }
    throw new Error(`Unsure how to argify ${argValue} (of type ${typeof argValue}).`);
  }
}
class GraphtonBaseEnum {
  value;
  constructor(value) {
    this.value = value;
  }
  valueOf() {
    return this.value;
  }
  toString() {
    return this.valueOf();
  }
}
const fieldObjectMap = {
  User: { id: null, username: null, age: null, role: null, posts: "Post", friends: "User" },
  Post: { id: null, author: "User", text: null, posted_at_date: null, posted_at_time: null, relatedPosts: "Post" },
};
export class Role extends GraphtonBaseEnum {
  static ADMIN = new Role("ADMIN");
  static USER = new Role("USER");
  static GUEST = new Role("GUEST");
  static possibleValues = { ADMIN: Role.ADMIN, USER: Role.USER, GUEST: Role.GUEST };
  constructor(value) {
    super(value);
  }
  static parse(value) {
    return Role.possibleValues[value];
  }
  static list() {
    return Object.values(Role.possibleValues);
  }
}
export class SortOrder extends GraphtonBaseEnum {
  static ASC = new SortOrder("ASC");
  static DESC = new SortOrder("DESC");
  static possibleValues = { ASC: SortOrder.ASC, DESC: SortOrder.DESC };
  constructor(value) {
    super(value);
  }
  static parse(value) {
    return SortOrder.possibleValues[value];
  }
  static list() {
    return Object.values(SortOrder.possibleValues);
  }
}
export class UserSortColumn extends GraphtonBaseEnum {
  static id = new UserSortColumn("id");
  static username = new UserSortColumn("username");
  static age = new UserSortColumn("age");
  static possibleValues = { id: UserSortColumn.id, username: UserSortColumn.username, age: UserSortColumn.age };
  constructor(value) {
    super(value);
  }
  static parse(value) {
    return UserSortColumn.possibleValues[value];
  }
  static list() {
    return Object.values(UserSortColumn.possibleValues);
  }
}
// REGION: Queries
export class Query {
  static users() {
    return new UsersQuery();
  }
  static usersOrdered(queryArgs) {
    const inst = new UsersOrderedQuery();
    if (typeof queryArgs !== "undefined") inst.setArgs(queryArgs);
    return inst;
  }
  static user(queryArgs) {
    const inst = new UserQuery();
    if (typeof queryArgs !== "undefined") inst.setArgs(queryArgs);
    return inst;
  }
  static userExists(queryArgs) {
    const inst = new UserExistsQuery();
    if (typeof queryArgs !== "undefined") inst.setArgs(queryArgs);
    return inst;
  }
  static healthCheck() {
    return new HealthCheckQuery();
  }
}
class UsersQuery extends GraphtonBaseQuery {
  queryName = "users";
  rootType = "query";
  returnType = "User";
  /**
   * Execute the query and get the results
   */
  async get(requestConfig = {}) {
    return await super.execute(requestConfig);
  }
}
applyMixins(UsersQuery, [GraphtonBaseQuery, GraphtonQueryReturnsObject]);
class UsersOrderedQuery extends GraphtonBaseQuery {
  queryName = "usersOrdered";
  rootType = "query";
  returnType = "User";
  /**
   * Execute the query and get the results
   */
  async get(requestConfig = {}) {
    return await super.execute(requestConfig);
  }
}
applyMixins(UsersOrderedQuery, [GraphtonBaseQuery, GraphtonQueryHasArguments, GraphtonQueryReturnsObject]);
class UserQuery extends GraphtonBaseQuery {
  queryName = "user";
  rootType = "query";
  returnType = "User";
  /**
   * Execute the query and get the results
   */
  async get(requestConfig = {}) {
    return await super.execute(requestConfig);
  }
}
applyMixins(UserQuery, [GraphtonBaseQuery, GraphtonQueryHasArguments, GraphtonQueryReturnsObject]);
class UserExistsQuery extends GraphtonBaseQuery {
  queryName = "userExists";
  rootType = "query";
  /**
   * Execute the query and get the results
   */
  async get(requestConfig = {}) {
    return await super.execute(requestConfig);
  }
}
applyMixins(UserExistsQuery, [GraphtonBaseQuery, GraphtonQueryHasArguments]);
class HealthCheckQuery extends GraphtonBaseQuery {
  queryName = "healthCheck";
  rootType = "query";
  /**
   * Execute the query and get the results
   */
  async get(requestConfig = {}) {
    return await super.execute(requestConfig);
  }
}
// REGION: Mutations
export class Mutation {
  static createUser(queryArgs) {
    const inst = new CreateUserMutation();
    if (typeof queryArgs !== "undefined") inst.setArgs(queryArgs);
    return inst;
  }
  static updateUser(queryArgs) {
    const inst = new UpdateUserMutation();
    if (typeof queryArgs !== "undefined") inst.setArgs(queryArgs);
    return inst;
  }
  static deleteUser(queryArgs) {
    const inst = new DeleteUserMutation();
    if (typeof queryArgs !== "undefined") inst.setArgs(queryArgs);
    return inst;
  }
}
class CreateUserMutation extends GraphtonBaseQuery {
  queryName = "createUser";
  rootType = "mutation";
  returnType = "User";
  /**
   * Execute the query and get the results
   */
  async do(requestConfig = {}) {
    return await super.execute(requestConfig);
  }
}
applyMixins(CreateUserMutation, [GraphtonBaseQuery, GraphtonQueryHasArguments, GraphtonQueryReturnsObject]);
class UpdateUserMutation extends GraphtonBaseQuery {
  queryName = "updateUser";
  rootType = "mutation";
  returnType = "User";
  /**
   * Execute the query and get the results
   */
  async do(requestConfig = {}) {
    return await super.execute(requestConfig);
  }
}
applyMixins(UpdateUserMutation, [GraphtonBaseQuery, GraphtonQueryHasArguments, GraphtonQueryReturnsObject]);
class DeleteUserMutation extends GraphtonBaseQuery {
  queryName = "deleteUser";
  rootType = "mutation";
  returnType = "User";
  /**
   * Execute the query and get the results
   */
  async do(requestConfig = {}) {
    return await super.execute(requestConfig);
  }
}
applyMixins(DeleteUserMutation, [GraphtonBaseQuery, GraphtonQueryHasArguments, GraphtonQueryReturnsObject]);
// REGION: Subscriptions
export class Subscription {
  static postAdded() {
    return new PostAddedSubscription();
  }
}
class PostAddedSubscription extends GraphtonBaseQuery {
  queryName = "postAdded";
  rootType = "subscription";
  returnType = "Post";
  /**
   * Execute the query and get the results
   */
  async subscribe(requestConfig = {}) {
    return await super.execute(requestConfig);
  }
}
applyMixins(PostAddedSubscription, [GraphtonBaseQuery, GraphtonQueryReturnsObject]);
