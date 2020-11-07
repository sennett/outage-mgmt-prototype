const db = require('../db')
const { v4: uuidv4 } = require('uuid')
const { flagClientOut, flagClientOk, clientHasOutage } = require('./client-service-status-repository')

const clientIdsToDelete = []

const arrange = async (data) => {
  const start = new Date(Date.now())
  start.setDate(start.getDate() - 2)

  await Promise.all(data.map(r => db('client_service_status').insert({
    client_id: r.clientId,
    start,
    end: r.end
  })))

  clientIdsToDelete.push(...data.map(r => r.clientId))
}

describe('client-service-status-repository', () => {
  describe('clientHasOutage', () => {
    it('shows a client as up if we have no data for the client', async () => {
      expect.assertions(1)

      const hasOutage = await clientHasOutage(uuidv4())
      expect(hasOutage).toEqual(false)
    })

    it('shows a client as down if we have one row with no outage endate', async () => {
      expect.assertions(1)

      const clientId = uuidv4()

      await arrange([{ clientId }])

      const hasOutage = await clientHasOutage(clientId)
      expect(hasOutage).toEqual(true)
    })

    it('shows a client as down if we have one row with an outage endate and one row with no outage endate', async () => {
      expect.assertions(1)

      const clientId = uuidv4()

      await arrange([{ clientId, end: new Date() }, { clientId }])

      const hasOutage = await clientHasOutage(clientId)
      expect(hasOutage).toEqual(true)
    })

    it('shows a client as up if we have a completed row', async () => {
      expect.assertions(1)

      const clientId = uuidv4()

      await arrange([{ clientId, end: new Date() }])

      const hasOutage = await clientHasOutage(clientId)
      expect(hasOutage).toEqual(false)
    })

    it('shows a client as up if we have many completed rows', async () => {
      expect.assertions(1)

      const clientId = uuidv4()

      await arrange([{ clientId, end: new Date() }, { clientId, end: new Date() }, { clientId, end: new Date() }])

      const hasOutage = await clientHasOutage(clientId)
      expect(hasOutage).toEqual(false)
    })
  })

  describe('flagClientOk', () => {
    it('ends the current outage for the client with the passed time', async () => {
      expect.assertions(3)

      const clientId = uuidv4()
      const whenClientOutageEnded = new Date(Date.now())

      await arrange([{ clientId }])

      const outageStatusBeforeActing = await clientHasOutage(clientId)
      expect(outageStatusBeforeActing).toEqual(true)

      await flagClientOk(clientId, whenClientOutageEnded)

      const outageStatusAfterActing = await clientHasOutage(clientId)
      expect(outageStatusAfterActing).toEqual(false)

      expect((await db('client_service_status').where('client_id', clientId).first()).end).toEqual(whenClientOutageEnded)
    })

    it('does not update other outages for the client', async () => {
      expect.assertions(1)

      const clientId = uuidv4()
      const preexistingOutageEnd = new Date(Date.now())
      preexistingOutageEnd.setDate(-5)

      const whenClientOutageEnded = new Date(Date.now())
      await arrange([{ clientId }, { clientId, end: preexistingOutageEnd }])

      await flagClientOk(clientId, whenClientOutageEnded)

      const prexistingOutageRowsFound = (await db('client_service_status')
        .where({ client_id: clientId, end: preexistingOutageEnd })
        .count()
        .first()).count

      expect(prexistingOutageRowsFound).toEqual('1')
    })

    it('throws if the client does not have a current outage', async () => {
      expect.assertions(1)

      const clientId = uuidv4()

      await arrange([{ clientId, end: new Date() }])

      expect.assertions(1)

      await flagClientOk(clientId, new Date(Date.now()))
        .catch(err => {
          expect(err).toEqual(new Error(`attempted to flag client ${clientId} as ok, but they do not currently have an outage in the DB. ignoring.`))
        })
    })
  })

  describe('flagClientOut', () => {
    it('starts a new outage for the client with the passed time', async () => {
      expect.assertions(4)
      const clientId = uuidv4()
      const client = { firstName: 'first name', lastName: 'last name' }

      const outageStatusBeforeActing = await clientHasOutage(clientId)
      expect(outageStatusBeforeActing).toEqual(false)

      const outageStarted = new Date(Date.now())

      await flagClientOut(clientId, outageStarted, client)

      const outageStatusAfterActing = await clientHasOutage(clientId)
      expect(outageStatusAfterActing).toEqual(true)

      const rows = await db('client_service_status').where('client_id', clientId)

      expect(rows.length).toEqual(1)
      expect(rows[0]).toEqual(expect.objectContaining({ client_id: clientId, start: outageStarted, end: null, client }))

      clientIdsToDelete.push(clientId)
    })

    it('throws if the client currently has an outage', async () => {
      expect.assertions(1)
      const clientId = uuidv4()

      await arrange([{ clientId }])

      await expect(
        flagClientOut(clientId, new Date(Date.now()))
      )
        .rejects
        .toEqual(new Error(`attempted to flag client ${clientId} as out, but they currently have an outage in the DB. ignoring.`))
    })
  })

  afterAll(async () => {
    await db('client_service_status').whereIn('client_id', clientIdsToDelete).del()
    await db.destroy()
  })
})
