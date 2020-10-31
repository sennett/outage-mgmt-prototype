const path = require('path')

const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, 'migrations')
  }
})

module.exports = knex
