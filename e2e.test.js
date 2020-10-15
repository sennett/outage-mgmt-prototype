const nock = require('nock')
const app = require('./app')

const clientFixturesNoOutage = [
  {
    firstName: 'Tony Outage',
    hasOutage: false
  }, {
    firstName: 'Mary No Outage',
    hasOutage: false
  }
]

const clientFixturesOutage = [
  {
    firstName: 'Tony Outage',
    hasOutage: true
  }, {
    firstName: 'Mary No Outage',
    hasOutage: false
  }
]

describe('e2e clients clients with outages', () => {
  let messagingApiScope, sentMessagePrematurely

  beforeAll((done) => {
    nock(process.env.CRM_API)
      .get('/v1.0/clients')
      .query(true)
      .times(5)
      .reply(200, clientFixturesNoOutage)
      .get('/v1.0/clients')
      .query(true)
      .times(40)
      .reply(200, clientFixturesOutage)

    messagingApiScope = nock(process.env.MESSAGING_API)
      .post('/send-message', {
        firstName: 'Tony Outage',
        hasOutage: true
      })
      .reply(200)

    app()

    setTimeout(() => {
      sentMessagePrematurely = messagingApiScope.isDone()
    }, 34000)

    setTimeout(() => {
      done()
    }, 36000)
  }, 37000)

  it('does not message about the outage before 30 seconds', () => {
    expect(sentMessagePrematurely).toEqual(false)
  })

  it('sends a message about the client with an outage after 30 seconds', () => {
    expect(messagingApiScope.isDone()).toEqual(true)
  })

  afterAll(() => {
    nock.cleanAll()
  })
})
