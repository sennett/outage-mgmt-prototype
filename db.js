const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  migrations: {
    tableName: 'migrations'
  }
})

module.exports = knex
