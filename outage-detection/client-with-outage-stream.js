const { groupBy, filter, merge, takeUntil, distinctUntilChanged, flatMap, count, delay, mapTo } = require('rxjs/operators')
const { of } = require('rxjs')

const extractFirstEventOf30ContinuousSeconds = (interestingEvents) => interestingEvents
  .pipe(
    flatMap(firstInterestingEvent => of(firstInterestingEvent).pipe(
      merge(interestingEvents),
      takeUntil(of('anything').pipe(delay(30000))),
      count(),
      filter(count => count >= 30),
      mapTo(firstInterestingEvent)
    ))
  )

const isolateOutageForOneCient = (clientEvents) => {
  const outageEvents = clientEvents.pipe(filter(client => client.hasOutage))
  const continuousOutageSignals = extractFirstEventOf30ContinuousSeconds(outageEvents)

  const uppageEvents = clientEvents.pipe(filter(client => !client.hasOutage))
  const continuousUppageSignals = extractFirstEventOf30ContinuousSeconds(uppageEvents)

  return continuousOutageSignals.pipe(
    merge(continuousUppageSignals),
    distinctUntilChanged((p, q) => p.hasOutage === q.hasOutage),
    filter(signal => signal.hasOutage)
  )
}

module.exports = (allClientEvents) => {
  return allClientEvents.pipe(
    groupBy(client => client.id),
    flatMap(clientStream => isolateOutageForOneCient(clientStream))
  )
}
