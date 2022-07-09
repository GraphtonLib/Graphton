# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.6.8](https://github.com/GraphtonLib/Graphton/compare/v0.6.7...v0.6.8) (2022-07-09)


### Bug Fixes

* Scalar Properties rendering full type definition instead of just the name ([50bd7e5](https://github.com/GraphtonLib/Graphton/commit/50bd7e598bd0cb478e21ae435d0d5747df8f45c5))
* **security:** Force minimist ^1.2.6 ([049bdc6](https://github.com/GraphtonLib/Graphton/commit/049bdc6e8e689bc967acb3c1423bbcb30645491a))
* **security:** Force minimist ^1.2.6 ([0308b50](https://github.com/GraphtonLib/Graphton/commit/0308b503a53b613c20b2890ae687b1726736be85))

### [0.6.7](https://github.com/GraphtonLib/Graphton/compare/v0.6.6...v0.6.7) (2022-07-09)


### Bug Fixes

* Bug where enum was ignored in return type builders ([31507e2](https://github.com/GraphtonLib/Graphton/commit/31507e2b98f15a35a9abfabacb4e12cd7aaade79))

### [0.6.6](https://github.com/GraphtonLib/Graphton/compare/v0.6.5...v0.6.6) (2022-05-01)

### [0.6.5](https://github.com/GraphtonLib/Graphton/compare/v0.6.4...v0.6.5) (2022-05-01)


### Features

* Adds (alias) types for scalars and customization of custom scalar types ([ea75f69](https://github.com/GraphtonLib/Graphton/commit/ea75f69e767b5329bfe494a34877fa79e3fd00e2))


### Bug Fixes

* Add stacktrace to argify error ([c947e4b](https://github.com/GraphtonLib/Graphton/commit/c947e4bb11659602ffeeeb821a4593b4d93bc217))

### [0.6.4](https://github.com/GraphtonLib/Graphton/compare/v0.6.3...v0.6.4) (2022-01-23)

### Features

- Adds errors response as promise rejection ([8c1296d](https://github.com/GraphtonLib/Graphton/commit/8c1296d5eca9b283cf2a8bcdcc8685e961fbeb41))

### [0.6.3](https://github.com/GraphtonLib/Graphton/compare/v0.6.2...v0.6.3) (2022-01-15)

### Features

- Add exported types for the three different query types ([ed675b2](https://github.com/GraphtonLib/Graphton/commit/ed675b29856458892f3688e7931af36f801e1129))
- Added more usable exported types ([13d91b8](https://github.com/GraphtonLib/Graphton/commit/13d91b87a6a342a30a3d361fff9f41ab238ec8d3))

### [0.6.2](https://github.com/GraphtonLib/Graphton/compare/v0.6.1...v0.6.2) (2022-01-08)

### Features

- Add option to generate subscriptions factory ([a3d3c41](https://github.com/GraphtonLib/Graphton/commit/a3d3c413950e414b42727e1c29b5472dd3313dbe))
- Add options to customise the execution functions (get/do) to your own liking ([3102b17](https://github.com/GraphtonLib/Graphton/commit/3102b173143405244462d341ad6283c8ea9e2bc2))

### [0.6.1](https://github.com/GraphtonLib/Graphton/compare/v0.6.0...v0.6.1) (2022-01-04)

### Bug Fixes

- Fix a bug where ReturnTypeBuilder.except did not grab from the available fields ([8a5ea32](https://github.com/GraphtonLib/Graphton/commit/8a5ea32489574a1aae68a524fde3629fb32f5f6f))

## [0.6.0](https://github.com/GraphtonLib/Graphton/compare/v0.5.0...v0.6.0) (2022-01-04)

### ⚠ BREAKING CHANGES

- **refactor:** Rename the following methods: `with => select`, `withRelated => with`, `withoutRelated => without`
- **deprecated:** If you were using without() to remove fields from selection, flip your condition and use .select() to _add_ the field instead of removing it later.

### Features

- **deprecated:** Removes the without() method from ReturnTypeBuilder ([588e103](https://github.com/GraphtonLib/Graphton/commit/588e10386bb95cd036415c58201d078abf739ca3))
- **refactor:** Renamed with to select, withRelated to with and withoutRelated to without to be more in line with Laravel Eloquent ([dbeec50](https://github.com/GraphtonLib/Graphton/commit/dbeec50400e11dd5140c7c70200b50c768b768d1))

## [0.5.0](https://github.com/GraphtonLib/Graphton/compare/v0.4.1...v0.5.0) (2021-12-17)

### ⚠ BREAKING CHANGES

- Returned enums are now (typed) strings, but when they are input (args) they need to be an instance of the enum to ensure correct query building.

### Features

- Rework of Enum types ([d2544b8](https://github.com/GraphtonLib/Graphton/commit/d2544b86d4b7a541fbfd73cc22e8cbb5d3ec8509))

### [0.4.1](https://github.com/GraphtonLib/Graphton/compare/v0.4.0...v0.4.1) (2021-12-16)

### Bug Fixes

- Fix from last version is now compiled ([640d5c4](https://github.com/GraphtonLib/Graphton/commit/640d5c42f190d006088e391e3a6a432825bdfac2))

## [0.4.0](https://github.com/GraphtonLib/Graphton/compare/v0.3.0...v0.4.0) (2021-12-16)

### ⚠ BREAKING CHANGES

- ID scalars are now parsed as String

### Bug Fixes

- Parse GraphQL ID scalar to String instead of Int, following GraphQL spec ([2440065](https://github.com/GraphtonLib/Graphton/commit/2440065f3fd7d5f3d484e45472d60bc79acd3776))

## [0.3.0](https://github.com/GraphtonLib/Graphton/compare/v0.2.5...v0.3.0) (2021-12-14)

### ⚠ BREAKING CHANGES

- Enums should now be called with its object - to ensure enums are correctly parsed they should be wrapped in a GraphtonEnum class

### Features

- Complex argument structures ([0955879](https://github.com/GraphtonLib/Graphton/commit/095587942be7d6159a7ed0006c297764ac49de9a))
- Generation for InputObjects ([2b0119f](https://github.com/GraphtonLib/Graphton/commit/2b0119f44c488e140e70d4d8f981a2df7c47090c))
- Generation of Enums ([d600972](https://github.com/GraphtonLib/Graphton/commit/d600972b28049bf38d763ae1d2b89066d3e8e1c5))

### Bug Fixes

- Less complex argument generic typing ([77f032b](https://github.com/GraphtonLib/Graphton/commit/77f032b6ad4f0cb5af8d9b3887169a10f30aecc9))

### [0.2.5](https://github.com/GraphtonLib/Graphton/compare/v0.2.4...v0.2.5) (2021-12-12)

### Bug Fixes

- Less files are now packed with the package ([ec7f6d8](https://github.com/GraphtonLib/Graphton/commit/ec7f6d84159054562e506c4e465e73402e392737))

### [0.2.4](https://github.com/GraphtonLib/Graphton/compare/v0.2.3...v0.2.4) (2021-12-12)

### Bug Fixes

- Query argument - they now actually get set ([0064601](https://github.com/GraphtonLib/Graphton/commit/00646011f0f8cf73e224435a7556615fd894b0a9))

### [0.2.3](https://github.com/GraphtonLib/Graphton/compare/v0.2.2...v0.2.3) (2021-12-09)

### Bug Fixes

- Mutation queries not getting the same treatment from previous fixes to Query queries ([fd9a031](https://github.com/GraphtonLib/Graphton/commit/fd9a031658edca527a14f0e174ecfbddf25c5605))

### [0.2.2](https://github.com/GraphtonLib/Graphton/compare/v0.2.1...v0.2.2) (2021-12-09)

### Features

- Add `this` returntype to returnFields ([2578fbe](https://github.com/GraphtonLib/Graphton/commit/2578fbe7c3441e75b68ffe5b4ea8746f4b7c3cb4))

### Bug Fixes

- Generate `never` arguments for queries without arguments and remove constructors for argumentless queries ([6409e10](https://github.com/GraphtonLib/Graphton/commit/6409e10ceae42aadfe511c676ea8ec710f8913c7))
- Removes eslint-disable-next-line comments in generated file, which were left behind by the stubs ([bba38b2](https://github.com/GraphtonLib/Graphton/commit/bba38b25af909c03788f52179cb0e091ccaa23b4))
- Weirdness in top comment in generated file ([606ef0a](https://github.com/GraphtonLib/Graphton/commit/606ef0a639584281420d6d290dd2569e80934cb7))

### [0.2.1](https://github.com/GraphtonLib/Graphton/compare/v0.2.0...v0.2.1) (2021-12-09)

- Little more output flair ✨ ([24a7dd0](https://github.com/GraphtonLib/Graphton/commit/24a7dd0049eec51fcc145dc95502ce2178ed615c))

## [0.2.0](https://github.com/GraphtonLib/Graphton/compare/v0.1.2...v0.2.0) (2021-12-09)

### ⚠ BREAKING CHANGES

- Query parameters are replaced for one object to make the parameters feel more like how arguments work in GraphQL. `Mutation.createUser("Some name", 10)` => `Mutation.createUser({name: "Some name", age: 10})`.

### Features

- Rework overrides to be part of the base class only using types ([e998083](https://github.com/GraphtonLib/Graphton/commit/e9980833325c55d1b9ff6ffb92e7d9ec49199b12))
- Rework query arguments to be "named parameters" so they can be nullable in any order (makes it an object) ([e998083](https://github.com/GraphtonLib/Graphton/commit/e9980833325c55d1b9ff6ffb92e7d9ec49199b12))

### Bugfixes

- Type safety in some cases ([e998083](https://github.com/GraphtonLib/Graphton/commit/e9980833325c55d1b9ff6ffb92e7d9ec49199b12))

### [0.1.2](https://github.com/GraphtonLib/Graphton/compare/v0.1.1...v0.1.2) (2021-12-06)

### Features

- **ci:** "Draft release" workflow ([9e2ae99](https://github.com/GraphtonLib/Graphton/commit/9e2ae99442432834fea575c6fa96f83f380ea79e))
- Support for transpiling generated output automatically to pure javascript ([2ff0966](https://github.com/GraphtonLib/Graphton/commit/2ff0966e00ebafc626bda468319305df9af13a02))

### [0.1.1](https://github.com/GraphtonLib/Graphton/compare/v0.1.0...v0.1.1) (2021-12-05)

### Features

- Adds function overloads to better type nested returns ([d4477df](https://github.com/GraphtonLib/Graphton/commit/d4477df19fbac70a444c5c77369dbb20a4259a77))

## [0.1.0](https://github.com/GraphtonLib/Graphton/compare/v0.0.3...v0.1.0) (2021-12-05)

### ⚠ BREAKING CHANGES

- GraphtonBaseQuery.do() now ONLY available for Mutatin type queries
- GraphtonBaseQuery.got() now ONLY available for Query type queries
- GraphtonBaseQuery.returnFields() not available anymore for non-OBJECT return types

### Bug Fixes

- Non-object type returns for queries ([4cc5046](https://github.com/GraphtonLib/Graphton/commit/4cc5046cb8f5d73bab3871a3e3b3acb9ff26c0e7))

### [0.0.3](https://github.com/GraphtonLib/Graphton/compare/v0.0.2...v0.0.3) (2021-12-04)

### Features

- Generator now leaves get() and do() for both queries and mutations ([d4200cc](https://github.com/GraphtonLib/Graphton/commit/d4200cceb86b882f8bb9e132ef29e24070852da8))
- Nested fields ([49c6daa](https://github.com/GraphtonLib/Graphton/commit/49c6daa6db62766a75f9a6cde840e48c8e9291d5))

### Bug Fixes

- changes default name of graphton file to ./src/graphton.generated.ts ([e1ec875](https://github.com/GraphtonLib/Graphton/commit/e1ec87547c116c71cadf02e495d84d224ad619a0))
- throw an error when trying to generate a .js file - for now. ([d1fb2a8](https://github.com/GraphtonLib/Graphton/commit/d1fb2a80dd5266a95843f77856997c78be43f3c3))

### 0.0.2 (2021-12-02)

### Features

- Adds query arguments ([9dcebf9](https://github.com/GraphtonLib/Graphton/commit/9dcebf9cc9cccdd060e58a317ed24824fe715979))
- Adds return type ([c28bf95](https://github.com/GraphtonLib/Graphton/commit/c28bf95bae5a3526c509d3ac2a9c1f7f2f358bcb))
- Generate types and basic queries ([f1f90bb](https://github.com/GraphtonLib/Graphton/commit/f1f90bbe948ff201f2cca23a928ee7af767e4d96))
