const { map, groupBy, filter, merge, tap, takeUntil, distinctUntilChanged, flatMap, count, delay, mapTo } = require('rxjs/operators')
const { of, combineLatest, from } = require('rxjs')
const logger = require('../logger')
const { flagClientOut, clientHasOutage, flagClientOk } = require('./client-service-status-repository')

const extractFirstEventOf30ContinuousSeconds = (interestingEvents) => interestingEvents
  .pipe(
    flatMap(firstInterestingEvent => of(firstInterestingEvent).pipe(
      merge(interestingEvents),
      takeUntil(of('anything').pipe(delay(parseInt(process.env.OUTAGE_FLAG_TIME_WINDOW_MS) || 30000))),
      count(),
      filter(count => count >= (parseInt(process.env.OUTAGE_FLAG_MIN_COUNT) || 30)),
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
    // only flag when outage statues changes from API
    // read from database
    // continue if outage API is different from what we have in the database
    // save new client state in the database - we know the new status

    flatMap(signal => combineLatest(of(signal), from(clientHasOutage(signal.id)))),
    filter(([clientFromApi, clientIsOutFromDb]) => {
      return clientFromApi.hasOutage !== clientIsOutFromDb
    }),
    map(([clientFromApi]) => clientFromApi),
    tap(client => {
      if (client.hasOutage) {
        flagClientOut(client.id)
      } else {
        flagClientOk(client.id)
      }
    }),

    filter(signal => signal.hasOutage)
  )
}

module.exports = (allClientEvents) => {
  return allClientEvents.pipe(
    tap(client => {
      if (!client.id) logger.warn('no id found for client', client)
    }),
    filter(client => client.id),
    groupBy(client => client.id),
    flatMap(clientStream => isolateOutageForOneCient(clientStream))
  )
}
