# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.3](https://github.com/GraphtonLib/Graphton/compare/v0.2.2...v0.2.3) (2021-12-09)


### Bug Fixes

* Mutation queries not getting the same treatment from previous fixes to Query queries ([fd9a031](https://github.com/GraphtonLib/Graphton/commit/fd9a031658edca527a14f0e174ecfbddf25c5605))

### [0.2.2](https://github.com/GraphtonLib/Graphton/compare/v0.2.1...v0.2.2) (2021-12-09)


### Features

* Add `this` returntype to returnFields ([2578fbe](https://github.com/GraphtonLib/Graphton/commit/2578fbe7c3441e75b68ffe5b4ea8746f4b7c3cb4))


### Bug Fixes

* Generate `never` arguments for queries without arguments and remove constructors for argumentless queries ([6409e10](https://github.com/GraphtonLib/Graphton/commit/6409e10ceae42aadfe511c676ea8ec710f8913c7))
* Removes eslint-disable-next-line comments in generated file, which were left behind by the stubs ([bba38b2](https://github.com/GraphtonLib/Graphton/commit/bba38b25af909c03788f52179cb0e091ccaa23b4))
* Weirdness in top comment in generated file ([606ef0a](https://github.com/GraphtonLib/Graphton/commit/606ef0a639584281420d6d290dd2569e80934cb7))

### [0.2.1](https://github.com/GraphtonLib/Graphton/compare/v0.2.0...v0.2.1) (2021-12-09)

* Little more output flair ✨ ([24a7dd0](https://github.com/GraphtonLib/Graphton/commit/24a7dd0049eec51fcc145dc95502ce2178ed615c))

## [0.2.0](https://github.com/GraphtonLib/Graphton/compare/v0.1.2...v0.2.0) (2021-12-09)


### ⚠ BREAKING CHANGES

* Query parameters are replaced for one object to make the parameters feel more like how arguments work in GraphQL. `Mutation.createUser("Some name", 10)` => `Mutation.createUser({name: "Some name", age: 10})`.

### Features

* Rework overrides to be part of the base class only using types ([e998083](https://github.com/GraphtonLib/Graphton/commit/e9980833325c55d1b9ff6ffb92e7d9ec49199b12))
* Rework query arguments to be "named parameters" so they can be nullable in any order (makes it an object) ([e998083](https://github.com/GraphtonLib/Graphton/commit/e9980833325c55d1b9ff6ffb92e7d9ec49199b12))

### Bugfixes

* Type safety in some cases ([e998083](https://github.com/GraphtonLib/Graphton/commit/e9980833325c55d1b9ff6ffb92e7d9ec49199b12))


### [0.1.2](https://github.com/GraphtonLib/Graphton/compare/v0.1.1...v0.1.2) (2021-12-06)


### Features

* **ci:** "Draft release" workflow ([9e2ae99](https://github.com/GraphtonLib/Graphton/commit/9e2ae99442432834fea575c6fa96f83f380ea79e))
* Support for transpiling generated output automatically to pure javascript ([2ff0966](https://github.com/GraphtonLib/Graphton/commit/2ff0966e00ebafc626bda468319305df9af13a02))

### [0.1.1](https://github.com/GraphtonLib/Graphton/compare/v0.1.0...v0.1.1) (2021-12-05)


### Features

* Adds function overloads to better type nested returns ([d4477df](https://github.com/GraphtonLib/Graphton/commit/d4477df19fbac70a444c5c77369dbb20a4259a77))

## [0.1.0](https://github.com/GraphtonLib/Graphton/compare/v0.0.3...v0.1.0) (2021-12-05)


### ⚠ BREAKING CHANGES

* GraphtonBaseQuery.do() now ONLY available for Mutatin type queries
* GraphtonBaseQuery.got() now ONLY available for Query type queries
* GraphtonBaseQuery.returnFields() not available anymore for non-OBJECT return types

### Bug Fixes

* Non-object type returns for queries ([4cc5046](https://github.com/GraphtonLib/Graphton/commit/4cc5046cb8f5d73bab3871a3e3b3acb9ff26c0e7))

### [0.0.3](https://github.com/GraphtonLib/Graphton/compare/v0.0.2...v0.0.3) (2021-12-04)


### Features

* Generator now leaves get() and do() for both queries and mutations ([d4200cc](https://github.com/GraphtonLib/Graphton/commit/d4200cceb86b882f8bb9e132ef29e24070852da8))
* Nested fields ([49c6daa](https://github.com/GraphtonLib/Graphton/commit/49c6daa6db62766a75f9a6cde840e48c8e9291d5))


### Bug Fixes

* changes default name of graphton file to ./src/graphton.generated.ts ([e1ec875](https://github.com/GraphtonLib/Graphton/commit/e1ec87547c116c71cadf02e495d84d224ad619a0))
* throw an error when trying to generate a .js file - for now. ([d1fb2a8](https://github.com/GraphtonLib/Graphton/commit/d1fb2a80dd5266a95843f77856997c78be43f3c3))

### 0.0.2 (2021-12-02)


### Features

* Adds query arguments ([9dcebf9](https://github.com/GraphtonLib/Graphton/commit/9dcebf9cc9cccdd060e58a317ed24824fe715979))
* Adds return type ([c28bf95](https://github.com/GraphtonLib/Graphton/commit/c28bf95bae5a3526c509d3ac2a9c1f7f2f358bcb))
* Generate types and basic queries ([f1f90bb](https://github.com/GraphtonLib/Graphton/commit/f1f90bbe948ff201f2cca23a928ee7af767e4d96))
