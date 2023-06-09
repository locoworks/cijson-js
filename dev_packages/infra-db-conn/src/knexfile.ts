import { Knex } from "knex";

// console.log("process.env.DB_HOST", process.env);

const config: Knex.Config = {
	client: process.env.DB_DIALECT,
	connection: {
		host: process.env.DB_HOST,
		port: Number(process.env.DB_PORT),
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		// ssl: {
		// 	// ca: fs.readFileSync(__dirname + "/../../cacert.pem"),
		// 	rejectUnauthorized: false,
		// },
	},
	migrations: {
		directory: ["../../commerce/database/migrations"],
		tableName: "migrations",
		// loadExtensions: [".js"],
	},
};

export default config;
// module.exports = config;
