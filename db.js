const logger = require('./logger')

const knex = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  migrations: {
    tableName: 'migrations'
  },
  log: {
    warn: (message) => {
      logger.warn('knex', message)
    },
    error: (message) => {
      logger.error('knex', message)
    },
    deprecate: (message) => {
      logger.warn('knex', message)
    },
    debug: (message) => {
      logger.debug('knex', message)
    }
  }
})

module.exports = knex
