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
yarn turbo run build --filter=@locoworks/cijson-engine...
yarn turbo run build --filter=@locoworks/cijson-utils...
```
