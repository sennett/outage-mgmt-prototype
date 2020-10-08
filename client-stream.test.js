const clientStream = require('./client-stream')
const nock = require('nock')

const serverResponse = [
  {
    firstName: 'Tony Outage',
    hasOutage: true
  }, {
    firstName: 'Mary No Outage',
    hasOutage: false
  }
]

describe('client-stream', () => {
  it('polls server every second', (done) => {
    const scope = nock(process.env.CRM_DOMAIN)
      .get('/crm/api/v1.0/clients')
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
})
