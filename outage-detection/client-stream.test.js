const clientStream = require('./client-stream')
const nock = require('nock')
const got = require('got')
const url = require('url')
const { isBefore, isAfter, isDate } = require('date-fns')

const logger = require('../logger')
logger.warn = jest.fn()

describe('client-stream', () => {
  it('polls server every second', (done) => {
    expect.assertions(2)
    const serverResponse = [
      {
        firstName: 'Tony Outage',
        hasOutage: true
      }, {
        firstName: 'Mary No Outage',
        hasOutage: false
      }
    ]

    const apiUrl = new url.URL(process.env.CRM_API)
    const scope = nock(apiUrl.origin)
      .get(apiUrl.pathname)
      .query({
        isArchived: 0,
        lead: 0
      })
      .times(5)
      .reply(200, serverResponse)

    const receivedClientNames = []

    clientStream().subscribe({
      next: client => {
        receivedClientNames.push(client.firstName)
      },
      error: err => done(err)
    })

    setTimeout(() => {
      expect(receivedClientNames).toContain('Tony Outage', 'Mary No Outage')
      expect(scope.isDone()).toEqual(true)
      done()
    }, 4500)
  })

  it('says when we retrieved the data', (done) => {
    expect.assertions(5)
    const serverResponse = [
      {
        firstName: 'Tony Outage',
        hasOutage: true
      }, {
        firstName: 'Mary No Outage',
        hasOutage: false
      }
    ]

    const apiUrl = new url.URL(process.env.CRM_API)
    const scope = nock(apiUrl.origin)
      .get(apiUrl.pathname)
      .query(true)
      .times(1)
      .reply(200, serverResponse)

    const startTime = new Date(Date.now())

    const timesRetrieved = []
    clientStream().subscribe({
      next: client => {
        timesRetrieved.push(client.retrievedAt)
      },
      error: err => done(err)
    })

    setTimeout(() => {
      const endTime = new Date(Date.now())
      const timeInRange = (clientRetrievedTime) => isBefore(clientRetrievedTime, endTime) && isAfter(clientRetrievedTime, startTime)
      expect(isDate(timesRetrieved[0])).toEqual(true)
      expect(isDate(timesRetrieved[1])).toEqual(true)
      expect(timeInRange(timesRetrieved[0])).toEqual(true)
      expect(timeInRange(timesRetrieved[1])).toEqual(true)
      expect(scope.isDone()).toEqual(true)
      done()
    }, 1500)
  })

  describe('error logging', () => {
    it.each`
    test                                           | status | responseBody                           | warnMessage                | warnPayload
    ${'warns when the API returns 400'}            | ${400} | ${'here is a response string for 400'} | ${'failed to get clients'} | ${got.HTTPError}
    ${'warns when the API returns 500'}            | ${500} | ${'here is a response string for 500'} | ${'failed to get clients'} | ${got.HTTPError}
    ${'warns when the API returns malformed JSON'} | ${200} | ${'here is some maformed JSON'}        | ${'failed to get clients'} | ${SyntaxError}
    `('$test', ({ status, responseBody, warnMessage, warnPayload }, done) => {
      expect.assertions(3)
      const apiUrl = new url.URL(process.env.CRM_API)
      const scope = nock(apiUrl.origin)
        .get(apiUrl.pathname)
        .query(true)
        .reply(status, responseBody)

      const observer = jest.fn()

      clientStream().subscribe({
        next: observer,
        error: observer,
        complete: observer
      })

      setTimeout(() => {
        expect(scope.isDone()).toEqual(true)
        expect(logger.warn).toHaveBeenCalledWith('failed to get clients', expect.any(warnPayload))
        expect(observer).not.toHaveBeenCalled()
        done()
      }, 500)
    }, 1000)
  })

  afterEach(() => {
    nock.cleanAll()
  })
})
