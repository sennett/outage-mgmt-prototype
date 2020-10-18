const { from, timer, of } = require('rxjs')
const { map, flatMap, catchError, tap } = require('rxjs/operators')
const got = require('got')
const logger = require('../logger')

const CLIENTS_URL = `${process.env.CRM_API}/v1.0/clients`
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
  map(response => {
    return JSON.parse(response.body)
  }),
  catchError(err => {
    logger.warn('failed to get clients', err)
    return of([])
  }))

module.exports = () => {
  let requestCount = 0
  return timer(0, 1000)
    .pipe(
      flatMap(request),
      tap(() => {
        requestCount++
        if (requestCount >= 600) {
          logger.info(`completed ${requestCount} requests to ${CLIENTS_URL}`)
          requestCount = 0
        }
      }),
      flatMap(listOfClients => from(listOfClients))
    )
}
