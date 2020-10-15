const { filter, merge, takeUntil, distinctUntilChanged, flatMap, count, delay, mapTo } = require('rxjs/operators')
const { of } = require('rxjs')

module.exports = (clientEvents) => {
  const outageEvents = clientEvents.pipe(filter(client => client.hasOutage))
  const continuousOutageSignals =
    outageEvents
      .pipe(
        flatMap(firstOutageEvent => of(firstOutageEvent).pipe(
          merge(outageEvents),
          takeUntil(of('anything').pipe(delay(30000))),
          count(),
          filter(count => count >= 30),
          mapTo(firstOutageEvent)
        ))
      )

  const uppageEvents = clientEvents.pipe(filter(client => !client.hasOutage))
  const continuousUppageSignals = uppageEvents
    .pipe(
      flatMap(firstUppageEvent => of(firstUppageEvent).pipe(
        merge(uppageEvents),
        takeUntil(of('anything').pipe(delay(30000))),
        count(),
        filter(count => count >= 30),
        mapTo(firstUppageEvent)
      ))
    )

  return continuousOutageSignals.pipe(
    merge(continuousUppageSignals),
    distinctUntilChanged((p, q) => p.hasOutage === q.hasOutage),
    filter(signal => signal.hasOutage)
  )
}
