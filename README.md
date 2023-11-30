### Migration

```
yarn db:migrate:make --migrations-directory dev_packages/commerce/database/migrations create_users_table
```

### Run nodejs fastify

```
yarn fna:dev
```

### Building an individual package

```
yarn turbo run build:publish --filter=@locoworks/cijson-engine...
yarn turbo run build:publish --filter=@locoworks/cijson-utils...
yarn turbo run build --filter=@locoworks/cijson-operator-pscale...
```
