# Upgrade guide

When upgrating to a new major version, here will be the steps required to upgrade.

## Index

- [v0 -> v1](#v0---v1)

### Upgrading v0.7 to v1

We changed the overall way how you select things. We didn't like the builder-like structure since it brings overhead and is not very readable for larger queries.

#### `returnFields` and their ReturnTypeBuilder classes are removed

We now have an object structure, fully typed (and thus autocompletable by good IDE's) and looks more like your typical graphql query.

#### `select()` is now on the query itself and accepts an object

```typescript
//v0.7
Query.users().returnFields(r => r.select("id").select("name"));

//v1
Query.users().select({
  id: {},
  name: {}
});
```

#### Selecting all shallow fields with `all()` is now `_all`

```typescript
//v0.7
Query.users().returnFields(r => r.all());

//v1
Query.users().select({
  _all: {}
});
```

#### `with()` is removed, use the object notation of `select()`

Here you can see how much cleaner it became.

```typescript
//v0.7
Query.users().returnFields(r => r.with("posts", r => r.all().with("comments", r => r.all())));

//v1
Query.users().select({
  posts: {
    _all: {},
    comments: {
      _all: {}
    }
  }
});
```
