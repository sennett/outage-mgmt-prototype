const db = require('../db')
const { flagClientOut, flagClientOk, clientHasOutage } = require('./client-service-status-repository')

const clientIdsToDelete = []

describe('client-service-status-repository', () => {
  describe('remembering outage', () => {
    it('returns false if we have not flagged a client out', async () => {
      const missingClientId = 'missing client id'
      expect(await clientHasOutage(missingClientId)).toEqual(false)

      clientIdsToDelete.push(missingClientId)
    })

    it('returns false if we have flagged a client up', async () => {
      const upClientId = 'up client id'
      await flagClientOk(upClientId)
      expect(await clientHasOutage(upClientId)).toEqual(false)
      clientIdsToDelete.push(upClientId)
    })

    it('returns true if we have flagged a client as down', async () => {
      const downClientId = 'down client id'
      await flagClientOut(downClientId)
      expect(await clientHasOutage(downClientId)).toEqual(true)
      clientIdsToDelete.push(downClientId)
    })
  })

  describe('cleanup', () => {
    it('flagClientOut does not create a new row with the same client ID', async () => {
      const multipleDownClientId = 'multiple down client id'
      await flagClientOut(multipleDownClientId)
      await flagClientOut(multipleDownClientId)
      expect((await db('client_service_status').where('client_id', multipleDownClientId).count().first()).count).toEqual('1')
      clientIdsToDelete.push(multipleDownClientId)
    })

    it('flagClientUp does not create a new row with the same client ID', async () => {
      const multipleUpClientId = 'multiple up client id'
      await flagClientOk(multipleUpClientId)
      await flagClientOk(multipleUpClientId)
      expect((await db('client_service_status').where('client_id', multipleUpClientId).count().first()).count).toEqual('1')
      clientIdsToDelete.push(multipleUpClientId)
    })
  })

  afterAll(async () => {
    await db('client_service_status').whereIn('client_id', clientIdsToDelete).del()
    await db.destroy()
  })
})
