require("dotenv/config");

const knex = require("knex");

const DB_ENV = "DEV";

const connectionOptions = {
  client: "pg",
  connection: {
    host: process.env[`DB_${DB_ENV}_HOST`],
    port: process.env[`DB_${DB_ENV}_PORT`],
    user: process.env[`DB_${DB_ENV}_USER`],
    password: process.env[`DB_${DB_ENV}_PASSWORD`],
    database: process.env[`DB_${DB_ENV}_NAME`]
  },
  migrations: {
    tableName: "knex_migrations",
    directory: `./db/migrations`
  }
};

const db = knex(connectionOptions);

const dbMigrations = () =>
  db.migrate
    .latest()
    .then(() => console.log("Migrations done!"))
    .catch(err => console.log(err));
const getLast = () =>
  db("historic_btc")
    .select("timestamp")
    .orderBy("timestamp", "desc")
    .first();

const insertBatch = insertData =>
  db.batchInsert("historic_btc", insertData, 1000);

module.exports = {
  dbMigrations,
  getLast,
  insertBatch
};
