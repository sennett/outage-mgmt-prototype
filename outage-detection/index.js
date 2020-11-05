const clientServiceStatusStream = require('./client-service-status-stream')
const clientStream = require('./client-stream')
const managerNotifier = require('./manager-notifier')
const logger = require('../logger')
const { curry } = require('lodash')

module.exports = () => {
  logger.info('starting client outage stream')
  if (process.env.OUTAGE_FLAG_MIN_COUNT * process.env.CLIENT_API_HIT_INTERVAL_MS >= process.env.OUTAGE_FLAG_TIME_WINDOW_MS) {
    logger.error('cannot trigger outages - process.env.OUTAGE_FLAG_MIN_COUNT * process.env.CLIENT_API_HIT_INTERVAL_MS >= process.env.OUTAGE_FLAG_TIME_WINDOW_MS')
    logger.error('process.env.OUTAGE_FLAG_MIN_COUNT', { OUTAGE_FLAG_MIN_COUNT: process.env.OUTAGE_FLAG_MIN_COUNT })
    logger.error('process.env.CLIENT_API_HIT_INTERVAL_MS', { CLIENT_API_HIT_INTERVAL_MS: process.env.CLIENT_API_HIT_INTERVAL_MS })
    logger.error('process.env.OUTAGE_FLAG_TIME_WINDOW_MS', { OUTAGE_FLAG_TIME_WINDOW_MS: process.env.OUTAGE_FLAG_TIME_WINDOW_MS })
  }

  const clientsWithOutages = clientServiceStatusStream(clientStream())

  clientsWithOutages.subscribe({
    next: managerNotifier,
    error: curry(logger.error, 2)('clients with outages stream crashed'),
    complete: curry(logger.error, 2)('clients with outages stream completed (it should never complete....)')
  })

  logger.info('started client outage stream')
}
