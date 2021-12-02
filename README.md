# Graphton
A JS/TS generator that builds a GraphQL query builder for your API

> Note: this package is still in beta. There is still features missing.

## Installing

You can install Graphton to your dev-dependencies using a package manager.

#### Yarn (recommended)

```bash
yarn add -D @graphtonlib/grapton
# Then to run:
yarn graphton generate https://example.com/graphql
```

#### npm

```bash
npm i --save-dev @graphtonlib/grapton
# Then to run:
npm run graphton generate https://example.com/graphql
```

## CLI Usage & options

```text
Usage: graphton generate [options] <schemaUri>

Arguments:
  schemaUri                      URL to GraphQL endpoint or path to introspection json.

Options:
  -o, --outputFile <path>        Path to the generated js/ts file (default: "./src/graphton.js")
  -q, --exportQueryFactoryAs <name>     How you want to import your queries instance. (default: "query")
  -m, --exportMutationFactoryAs <name>  How you want to import your mutations instance. (default: "mutation")
  -h, --help                     display help for command
```

### Example usage

```bash
npx @graphtopnlib/graphton generate -o ./src/lib/graphton.js https://example.com/graphql 
```

## Generated File Reference

When the js file is generated you can import the query and mutation factories from it. 

```typescript
import {query, mutation} from "./graphton.generated.js";
```

> For the following examples, the example graphql schema from [example/schema.graphql](example/schema.graphql) will be used.

### GraphtonQueryBuilderFactory.\[field\]([...args])

Starts building a query to [field] with [args]

```typescript
import {query} from "./example/graphton.generated.js";
const usersQuery = query.users();
const getFirstUserQuery = query.user(1);
```

### GraphtonMutationBuilderFactory.\[field\]([...args])

Starts building a mutation to [field] with [args]

```typescript
import {mutation} from "./example/graphton.generated.js";
const newUser = mutation.createUser("User Infinite").allFields().do();
const updatedUser = mutation.updateUser(1, "User NotOne", 12).allFields().do();
```

### GraphtonQuery

After creating a query from the query factory, you can start to add the field you want to get in return and execute the query.


#### .allFields(): this

Add all known fields for that return type

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().allFields();
// Selected fields are now: id, name, age
```

#### .clearFields(): this

Clears all selected fields from the query

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().allFields().clearFields();
// Selected fields are now: none
```

#### .withFields(...fieldNames: (string|string[])[]): this

Adds selected fields to the query

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().withFields("id", "name");
// Selected fields are now: id, name
```

#### .withField(fieldName: string): this

Adds one field to the query 

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().withField("id");
// Selected fields are now: id
```
#### .withoutFields(...fieldNames: (string|string[])[]): this

Removes selected fields from the query

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().allFields().withoutFields("id", "name");
// Selected fields are now: age
```
#### .withoutField(fieldName: string): this

Removes one selected field from the query

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().allFields().withoutField("id");
// Selected fields are now: name, age
```
#### .except(...fieldNames: (string|string[])[]): this

Adds all fields to the query, except the selected.

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().except("id");
// Selected fields are now: name, age
```
#### .only(...fieldNames: (string|string[])[]): this

Removes all fields from the query and only re-adds the selected fields

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().only("id");
// Selected fields are now: id
```
#### .toQuery(): string

Builds the query string and returns it.

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().allFields().toQuery();
// query users { users { id name age } }
```
#### .get(requestOptions: RequestOptions = {}): Promise<QueryResponse>
Executes the call to the GraphQL server.

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().allFields().get();

// users = {
//     data: [
//         {
//             id: 1,
//             name: "User One"
//         },
//         {
//             id: 2,
//             name: "User Two"
//         },
//         //...
//     ]
//     response: /*AxiosReponse*/,
// }
```

#### .do(requestOptions: RequestOptions = {}): Promise<QueryResponse>

Is an alias of .get. Generally it sounds better to use `.get` for queries and `.do` for mutations.
