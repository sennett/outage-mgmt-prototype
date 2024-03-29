const { from, timer, of } = require('rxjs')
const { map, flatMap, catchError, tap } = require('rxjs/operators')
const got = require('got')
const logger = require('../logger')

const CLIENTS_URL = process.env.CRM_API
logger.info('CLIENTS_URL', { url: CLIENTS_URL })

const request = () => from(got(CLIENTS_URL, {
  headers: {
    Accept: 'application/json',
    'x-auth-token': process.env.CRM_API_KEY
  },
  searchParams: {
    isArchived: 0,
    lead: 0
  }
}
)).pipe(
  map(response => ({
    clientList: JSON.parse(response.body),
    retrievedAt: new Date(Date.now())
  })),
  catchError(err => {
    logger.warn('failed to get clients', err)
    return of({ clientList: [], retrievedAt: undefined })
  }))

module.exports = () => {
  let requestCount = 0
  return timer(0, process.env.CLIENT_API_HIT_INTERVAL_MS || 1000)
    .pipe(
      flatMap(request),
      tap(() => {
        requestCount++
        if (requestCount >= 600) {
          logger.info(`completed ${requestCount} requests to ${CLIENTS_URL}`)
          requestCount = 0
        }
      }),
      flatMap(responseInfo => from(responseInfo.clientList)
        .pipe(
          map(client => ({
            ...client,
            retrievedAt: responseInfo.retrievedAt
          }))
        )
      )
    )
}
