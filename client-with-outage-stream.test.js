const got = require('got')
const nock = require('nock')
const clientWithOutageStream = require('./client-with-outage-stream')

const clientWithOutageFixture = [
  {
    firstName: 'Tony Outage',
    hasOutage: true
  }
]

const clientWithoutOutageFixture = [
  {
    firstName: 'Mary No Outage',
    hasOutage: false
  }
]

describe('clients with outages', () => {
  it('returns a client with an outage', (done) => {
    nock(process.env.CRM_DOMAIN)
      .persist()
      .get('/crm/api/v1.0/clients')
      .query({
        isArchived: 0,
        lead: 0
      })
      .reply(200, clientWithOutageFixture)

    clientWithOutageStream().subscribe({
      next: client => {
        expect(client.firstName).toBe('Tony Outage')
        done()
      },
      error: err => done(err)
    })
  })

  it('does not return a client without an outage', (done) => {
    nock(process.env.CRM_DOMAIN)
      .persist()
      .get('/crm/api/v1.0/clients')
      .query({
        isArchived: 0,
        lead: 0
      })
      .reply(200, clientWithoutOutageFixture)

    const mockFn = jest.fn()

    clientWithOutageStream().subscribe({
      next: mockFn,
      error: err => done(err)
    })

    setTimeout(() => {
      expect(mockFn).not.toHaveBeenCalled()
      done()
    }, 4000)
  })

  it('calls nock', async () => {
    nock(process.env.CRM_DOMAIN)
      .get('/crm/api/v1.0/clients')
      .query({
        isArchived: 0,
        lead: 0
      })
      .reply(200, clientWithOutageFixture)

    const response = await got(`${process.env.CRM_DOMAIN}/crm/api/v1.0/clients`, {
      headers: {
        Accept: 'application/json',
        'x-auth-token': process.env.CRM_API_KEY
      },
      searchParams: {
        isArchived: 0,
        lead: 0
      }
    })
    expect(JSON.parse(response.body)[0].firstName).toEqual('Tony Outage')
  })

  afterEach(() => {
    nock.cleanAll()
  })
})
