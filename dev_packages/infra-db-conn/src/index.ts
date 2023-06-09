import knexConfig from "./knexfile";
import knex from "knex";
const knexInstance = knex(knexConfig);

export { knexConfig, knexInstance };
