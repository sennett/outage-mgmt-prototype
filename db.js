const path = require('path')

const knex = require('knex')({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  migrations: {
    tableName: 'migrations',
    directory: path.join(__dirname, 'migrations')
  }
})

module.exports = knex
