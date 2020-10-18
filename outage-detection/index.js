const clientWithOutageStream = require('./client-with-outage-stream')
const clientStream = require('./client-stream')
const managerNotifier = require('./manager-notifier')
const logger = require('../logger')
const { curry } = require('lodash')

module.exports = () => {
  const clientsWithOutages = clientWithOutageStream(clientStream())

  clientsWithOutages.subscribe({
    next: managerNotifier,
    error: curry(logger.error, 2)('clients with outages stream crashed'),
    complete: curry(logger.error, 2)('clients with outages stream completed (it should never complete....)')
  })

  logger.info('started client outage stream')
}
