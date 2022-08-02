![Graphton Logo](./.github/Branding/logo-text.png)

![Current package version](https://img.shields.io/github/package-json/v/GraphtonLib/Graphton?label=Current%20Version&style=flat-square)
![Downloads on NPM](https://img.shields.io/npm/dt/@graphtonlib/graphton?style=flat-square&label=Downloads)
![GitHub Release Date](https://img.shields.io/github/release-date/GraphtonLib/Graphton?label=Release%20Date&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/GraphtonLib/Graphton?style=flat-square)
[![Patreons](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Droboroads%26type%3Dpatrons&style=flat-square&label=Patreon)](https://www.patreon.com/roboroads)

# Graphton

A JS/TS generator that builds a GraphQL query builder for your API

## Index

- [Installing](#installing)
    - [Yarn](#yarn)
    - [npm](#npm)
- [CLI Usage & options](#cli-usage--options)
    - [Example CLI usage](#example-cli-usage)
    - [Tip: add to scripts](#tip-add-to-scripts)
- [Using the generated file](#using-the-generated-file)
    - [Build a query](#build-a-query)
    - [Add returnfields](#add-returnfields)
    - [Execute the query](#execute-the-query)
    - [Running a mutation](#running-a-mutation)
    - [Dynamically changing return fields](#dynamically-changing-return-fields)
    - [Global Settings](#global-settings)
- [Reference](#reference)
    - [Note: abstraction](#note-abstraction)
    - [GraphtonBaseQuery](#graphtonbasequery)
        - [setArgs](#setargs)
        - [select](#select)
        - [deselect](#deselect)
        - [toQuery](#toquery)
        - [get](#get)
        - [do](#do)
    - [GraphtonEnum](#graphtonenum)
        - [parse](#parse)
        - [list](#list)
    - [GraphtonSettings](#graphtonsettings)
        - [headers](#headers)
        - [graphqlEndpoint](#graphqlendpoint)
- [Links](#links)
- [Credits](#credits)
- [Contributing](#contributing)

## Installing

You can install Graphton to your dev-dependencies using a package manager.

#### Yarn

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
  schemaUri                                 URL to GraphQL endpoint or path to introspection json.

Options:
  -o, --outputFile <path>                   Path to the generated js/ts file (default: "./src/graphton.generated.ts")
  -q, --exportQueryFactoryAs <name>         How you want to import your query factory. (default: "Query")
  -m, --exportMutationFactoryAs <name>      How you want to import your mutation factory. (default: "Mutation")
  -s, --exportSubscriptionFactoryAs [name]  If you want a subscription factory, if no name provided "Subscription" will be used. (default: false)
  -Q, --queryFunction <name>                The name of the function that posts the query. (default: "get")
  -M, --mutateFunction <name>               The name of the function that posts the mutation. (default: "do")
  -S, --subscribeFunction <name>            The name of the function that posts the subscription. (default: "subscribe")
  -d, --defineScalar <scalars...>           Define custom scalars and their TS type. Use this if you don't want (some) scalars to be typed as string by default. (eg. --defineScalar Date=number Time=any)
  -h, --help                                display help for command
```

### Example CLI usage

```bash
yarn graphton generate -o ./src/lib/graphton.js https://example.com/graphql
```

### Tip: add to scripts

As you are creating a complete custom command to generate your SDK, it might become cumbersome to remember all the options you added to the command. It's a good idea to add it to your scripts object in your `package.json` so you and your team always use the same generator command.

```json
//package.json
{
  "scripts": {
    "generate": "graphton generate -o ./src/lib/graphton.js https://example.com/graphql"
  }
}
```

Then generate the files using:

```bash
yarn generate
# Or
npm run generate
```

## Using the generated file

When the ts/js file is generated you can import the `Query` and `Mutation` factory instances from it.

```typescript
import { Query, Mutation } from "./graphton.generated.js";
```

> Note: the names `Query` and `Mutation` are configurable! See [CLI Usage & options](#CLI+Usage+&+options)

> Note: Since graphton does not handle subscriptions (yet?) since implementations can differ per-situation, subscription queries are optional. See [CLI Usage & options](#CLI+Usage+&+options) to how to generate them. You can use `getQuery` to output the query and use your own implementation.

> For the following examples, the example graphql schema from [example/schema.graphql](example/schema.graphql) will be used.

### Build a query

Starting a new query is fairly simple. Import `Query` from the generated file and call the method with the same name as the query you want to execute.

```typescript
import { Query } from "./example/graphton.generated.js";

const usersQuery = Query.users();
const getFirstUserQuery = Query.user({ id: 1 });
```

### Add returnfields

In GraphQL you have to define which fields you want to get in return. You define which ones by using `select`

```typescript
import { Query } from "./example/graphton.generated.js";

const usersQuery = Query.users().returnFields((r) => r.all());
const getFirstUserQuery = Query.user({ id: 1 }).select({
  id: {},
  name: {},
  posts: {
    text: {},
  },
});
```

### Execute the query

After building the query, you can directly execute it with the `get()` method.

```typescript
import { Query } from "./example/graphton.generated.js";

const firstUser = await Query.user({ id: 1 })
  .select({
    id: {},
    name: {},
    posts: {
      text: {},
    },
  })
  .get();

// firstUser = {
//     data: {
//         id: 1,
//         name: 'User One',
//         posts: [
//             {
//                 text: 'A sample post!'
//             },
//             {
//                 text: 'Enother sample post'
//             }
//         ]
//     },
//     axiosResponse: /*AxiosReponse*/,
// }
```

### Running a mutation

Running mutations is about the same as running a query. The only diferences are:

- You import `Mutation` instead of `Query`.
- Instead of `.get()` you run `.do()`

```typescript
import { Mutation } from "./example/graphton.generated.js";

const newUser = await Mutation.createUser({ name: "User Infinite" })
  .select({ _all: {} }) // _all will expand automatically to return all shallow fields
  .do();
const updatedUser = await Mutation.updateUser({ id: 1, name: "User NotOne", age: 12 })
  .select({ _all: {} }) // Selecting all shallow fields again
  .deselect({ name: {} }) // But removing name
  .do();
```

### Dynamically changing return fields

Return fields can be dynamically changed.

```typescript
import { Query } from "./example/graphton.generated.js";

const firstUserQuery = Query.user({ id: 1 }).select({
  id: {},
  name: {}
});

if (getUserPosts) {
  // Adds text of all posts to the query - does NOT replace the already selected id and name
  firstUserQuery.select({
    posts: {
      text: {},
    },
  });
}
```

### Global Settings

You can change some of the settings, used for making the call to the server, like URL or headers.

```typescript
import { GraphtonSettings } from "./example/graphton.generated.js";

GraphtonSettings.headers = { Authentication: "Bearer XXX" };
```

## Reference

### Note: abstraction

Most of the reference underneath here is **very abstract**, since we do not know how the external GraphQL schema looks like which you are going to use this on. Because of this, whenever you see a `$` next to something in this guide means that **it's a value or type that is replaced to accomodate your GraphQL schema**.

That said, if you use the .ts variant of the generated output, tsc or your IDE can tell you exactly where something goes wrong.

**This is why we recommend TypeScript**. The JavaScrips variant works just fine, but without any error correction or autocomplete it might be a little harder to do the thing you want to do.

### GraphtonBaseQuery

_GraphtonBaseQuery_ is abstract, the classes you will call are generated and extended from this base class.

#### setArgs

_Only available if the query has arguments_

Signature: `setArgs(queryArgs: $ArgumentType): this`

Set the arguments for this query to `queryArgs` (overwriting previous arguments).

#### select

_Only available if the return type is an OBJECT_

`select(fields: Partial<$FieldSelectorType>): this`

Add new fields to the return object (merges recursively).

#### deselect

_Only available if the return type is an OBJECT_

Signature: `deselect(fields: Partial<$FieldSelectorType>): this`

Removes selected fields from the query.

> Note: _all will also remove objects instead of just the shallow fields.

#### toQuery

Signature: `toQuery(): string`

Transform to graphql Query string.

#### get

_Only available on Query type requests_

Signature: `get(requestConfig: AxiosRequestConfig = {}): Promise<QueryResponse & { [p:string]: any; axiosResponse: AxiosResponse; }>`

Execute the query and get the results.

#### do

_Only available on Mutation type requests_

Signature: `do(requestConfig: AxiosRequestConfig = {}): Promise<QueryResponse & { [p:string]: any; axiosResponse: AxiosResponse; }>`

Do the mutation on the server.

### GraphtonEnum

Intermediary class used to correctly parse Enums in arguments. Your Enum values can be gotten with how you would normally call an enum.

```typescript
Query.usersOrdered({
  orderBy: [
    {
      column: UserSortColumn.age,
      order: SortOrder.ASC,
    },
  ],
});
```

#### parse

> public static parse(value: keyof typeof $GraphtonEnum.possibleValues): $GraphtonEnum

Transforms a string into an enum.

Alias:

```typescript
$GraphtonEnum.VALUE;
// Is the same as
$GraphtonEnum.parse("VALUE");
```

#### list

> public static list(): $GraphtonEnum[]

Gives you a list of possible enums

### GraphtonSettings

Graphton uses the static properties of this class, so you can customize these.

#### headers

> public static headers = { };

Set the headers for each following request to the server.

```typescript
GraphtonSettings.headers = { Authorization: "Bearer 123abc" };
```

#### graphqlEndpoint

> public static graphqlEndpoint: string = '<URL of retrospection>';

Set the URL to the GraphQL endpoint, defaults to the URL used when generating the file.

```typescript
GraphtonSettings.graphqlEndpoint = "https://mycoolexample.app/graphql";
```

## Links

- [💡 GitHub Issues](https://github.com/Roboroads/laravel-tinker/issues): feature requests and bug reports
- [🙏🏼 Patreon](https://www.patreon.com/roboroads): Consider supporting this project if it helped you 😊

## Credits

- [Robbin "Roboroads" Schepers](https://github.com/Roboroads) - Creator / First contributor.
- Other github projects:
    - [laravel/laravel](https://github.com/laravel/laravel) - This plugin is inspired by the way Laravel Eloquent builds queries.
- [Contributors to this project](https://github.com/Roboroads/laravel-tinker/graphs/contributors)
    - _I **will** name you seperately if your amount of contributions is exceptional_

## Contributing

Any tips or feedback is welcome in the [Issues Tab](https://github.com/Roboroads/laravel-tinker/issues) - or better, make me a PR!

Want to be part of Graphton? Every positive contribution is welcome!
