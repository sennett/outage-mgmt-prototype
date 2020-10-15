const clientWithOutageStream = require('./client-with-outage-stream')
const clientStream = require('./client-stream')
const managerNotifier = require('./manager-notifier')
const { groupBy, flatMap } = require('rxjs/operators')

module.exports = () => {
  console.log('starting client outage stream')
  const clientsWithOutages = clientStream().pipe(
    groupBy(client => client.id),
    flatMap(clientStream => clientWithOutageStream(clientStream))
  )

  clientsWithOutages.subscribe(managerNotifier)
  console.log('.... started')
}
