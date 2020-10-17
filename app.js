const clientWithOutageStream = require('./client-with-outage-stream')
const clientStream = require('./client-stream')
const managerNotifier = require('./manager-notifier')
const { groupBy, flatMap } = require('rxjs/operators')
const logger = require('./logger')
const { curry } = require('lodash')

module.exports = () => {
  logger.info('starting client outage stream')
  const clientsWithOutages = clientStream().pipe(
    groupBy(client => client.id),
    flatMap(clientStream => clientWithOutageStream(clientStream))
  )

  clientsWithOutages.subscribe({
    next: managerNotifier,
    error: curry(logger.error, 2)('app crashed'),
    complete: curry(logger.error, 2)('app completed (it should never complete....)')
  })

  logger.info('started client outage stream')
}
