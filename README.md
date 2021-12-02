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

## Usage & options

```text
Usage: graphton generate [options] <schemaUri>

Arguments:
  schemaUri                URL or path to the external GraphQL schema

Options:
  -o, --outputFile <path>  Path to the generated js file (default: "./src/graphton.js")
  -h, --help               display help for command

```

### Example usage


## Using the generated file

When the js file is generated you can import the query and mutation objects from the generated file. 

```typescript

```

