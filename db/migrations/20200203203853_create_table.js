exports.up = async knex =>
  knex.schema.createTable("historic_btc", table => {
    table
      .increments("id_historic_btc")
      .primary()
      .unsigned()
      .notNullable();
    table.datetime("timestamp");
    table.string("symbol");
    table.float("open");
    table.float("close");
    table.float("high");
    table.float("low");
    table.integer("trades");
    table.integer("volume");
    table.float("vwap");
    table.integer("lastSize");
    table.bigInteger("turnover");
    table.float("homeNotional");
    table.float("foreignNotional");

    table.unique("timestamp");
  });

exports.down = knex => knex.schema.dropTable("historic_btc");
