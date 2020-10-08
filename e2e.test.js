const got = require('got')
const nock = require('nock')
const clientWithOutageStream = require('./client-with-outage-stream')
const clientStream = require('./client-stream')

const clientFixtures = [
  {
    firstName: 'Tony Outage',
    hasOutage: true
  }, {
    firstName: 'Mary No Outage',
    hasOutage: false
  }
]

describe('e2e clients clients with outages', () => {
  const mockFn = jest.fn()
  let numCallsPre30Seconds

  beforeAll((done) => {
    nock(process.env.CRM_DOMAIN)
      .persist()
      .get('/crm/api/v1.0/clients')
      .query({
        isArchived: 0,
        lead: 0
      })
      .reply(200, clientFixtures)

    clientWithOutageStream(clientStream()).subscribe({
      next: mockFn,
      error: err => done(err)
    })

    setTimeout(() => {
      numCallsPre30Seconds = mockFn.mock.calls.length
    }, 29000)

    setTimeout(() => {
      done()
    }, 31000)
  }, 32000)

  it('returns a client with an outage after 30 seconds', () => {
    expect(mockFn).toHaveBeenCalledWith(expect.objectContaining({
      firstName: 'Tony Outage'
    }))
  })

  it('does not return a client without an outage after 30 seconds', () => {
    expect(mockFn).not.toHaveBeenCalledWith(expect.objectContaining({
      firstName: 'Mary No Outage'
    }))
  })

  it('does not return anything before 30 seconds', () => {
    expect(numCallsPre30Seconds).toStrictEqual(0)
  })

  afterAll(() => {
    nock.cleanAll()
  })
})
