const nock = require('nock')
const URL = require('url').URL
const { v4: uuidv4 } = require('uuid')

jest.mock('./manager-notifier')

const managerNotifier = require('./manager-notifier')
const outageDetection = require('./index')

const tonysId = uuidv4()
const marysId = uuidv4()
const clientFixturesNoOutage = [
  {
    id: tonysId,
    firstName: 'Tony Outage',
    hasOutage: false
  }, {
    id: marysId,
    firstName: 'Mary No Outage',
    hasOutage: false
  }
]

const clientFixturesOutage = [
  {
    id: tonysId,
    firstName: 'Tony Outage',
    hasOutage: true
  }, {
    id: marysId,
    firstName: 'Mary No Outage',
    hasOutage: false
  }
]

xdescribe('e2e clients clients with outages', () => {
  let sentMessagePrematurely

  beforeAll((done) => {
    const apiUrl = new URL(process.env.CRM_API)
    nock(apiUrl.origin)
      .get(apiUrl.pathname)
      .query(true)
      .times(5)
      .reply(200, clientFixturesNoOutage)
      .get(apiUrl.pathname)
      .query(true)
      .times(40)
      .reply(200, clientFixturesOutage)

    outageDetection()

    setTimeout(() => {
      sentMessagePrematurely = managerNotifier.mock.calls.length > 0
    }, 34000)

    setTimeout(() => {
      done()
    }, 36000)
  }, 37000)

  it('does not message about the outage before 30 seconds', () => {
    expect(sentMessagePrematurely).toEqual(false)
  })

  it('sends a message about the client with an outage after 30 seconds', () => {
    expect(managerNotifier).toHaveBeenCalledWith(expect.objectContaining({
      firstName: 'Tony Outage',
      hasOutage: true
    }))
  })

  afterAll(() => {
    nock.cleanAll()
  })
})
