const { filter, groupBy, merge, takeUntil, flatMap, count, map, delay, mapTo, mergeAll } = require('rxjs/operators')
const { of } = require('rxjs')

module.exports = (allClientsStream) => allClientsStream
  .pipe(
    filter(client => client.hasOutage),
    groupBy(client => client.id),
    map(eventsForClient => eventsForClient
      .pipe(
        map(firstEventForClient => of(firstEventForClient).pipe(
          merge(eventsForClient),
          takeUntil(of('anything').pipe(delay(5))),
          count(),
          filter(count => count >= 3),
          mapTo(firstEventForClient)
        )),
        mergeAll()
      )
    ),
    flatMap(client => client)
  )
