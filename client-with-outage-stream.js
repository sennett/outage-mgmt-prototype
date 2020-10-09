const { filter, groupBy, merge, takeUntil, distinctUntilChanged, flatMap, count, map, delay, mapTo, mergeAll } = require('rxjs/operators')
const { of } = require('rxjs')

module.exports = (allClientsStream) => allClientsStream
  .pipe(
    filter(client => client.hasOutage),
    groupBy(client => client.id),
    flatMap(eventsForClient => eventsForClient
      .pipe(
        map(firstEventForClient => of(firstEventForClient).pipe(
          merge(eventsForClient),
          takeUntil(of('anything').pipe(delay(30000))),
          count(),
          filter(count => count >= 30),
          mapTo(firstEventForClient)
        )),
        mergeAll(),
        distinctUntilChanged((p, q) => p.hasOutage === q.hasOutage)
      )
    )
  )
