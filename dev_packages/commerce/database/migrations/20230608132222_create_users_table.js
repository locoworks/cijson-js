exports.up = async function (knex) {
  return knex.schema.createTable("access_users", function (table) {
    table.string("id").notNullable().primary();
    table.string("tenant_id").notNullable();
    table.string("password", 255);
    table.jsonb("meta");
    table.datetime("created_at");
    table.datetime("updated_at");
    table.datetime("deleted_at");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("access_users");
};
