const clientWithOutageStream = require('./client-with-outage-stream')
const clientStream = require('./client-stream')
const managerNotifier = require('./manager-notifier')
const { groupBy, flatMap } = require('rxjs/operators')
const logger = require('./logger')

module.exports = () => {
  logger.info('starting client outage stream')
  const clientsWithOutages = clientStream().pipe(
    groupBy(client => client.id),
    flatMap(clientStream => clientWithOutageStream(clientStream))
  )

  clientsWithOutages.subscribe(managerNotifier)
  logger.info('started client outage stream')
}
