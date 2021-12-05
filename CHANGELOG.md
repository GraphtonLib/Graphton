# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
