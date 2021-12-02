# Graphton
A JS/TS generator that builds a GraphQL query builder for your API

## How to run

There is a lot of way to use Graphton. Installing is optional, even, with the help of npx.

### Using npx

No installing needed! Just run it through npx to run without installing.

```bash
npx @graphtopnlib/graphton generate https://example.com/graphql
```

### Installing locally

You can add a local copy of Graphton to your dev-dependencies.

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
const getFirstUser = query.user(1);
```

### GraphtonQuery

After creating a query from the query factory, you can start to add the field you want to get in return and execute the query.


#### .allFields(): this

Add all known fields for that return type

```typescript
import {query} from "./example/graphton.generated.js";
const users = await query.users().allFields().get();
```

#### .clearFields(): this
#### .withFields(...fieldNames: (string|string[])[]): this
#### .withField(fieldName: string): this
#### .withoutFields(...fieldNames: (string|string[])[]): this
#### .withoutField(fieldName: string): this
#### .except(...fieldNames: (string|string[])[]): this
#### .only(...fieldNames: (string|string[])[]): this
#### .get(requestOptions: RequestOptions = {}): Promise<AxiosResponse>

Run the built query

```typescript
import {query} from "./example/graphton.generated.js";
const users = query.users().get();
```
