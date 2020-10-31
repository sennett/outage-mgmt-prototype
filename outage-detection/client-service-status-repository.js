const db = require('../db')

module.exports = {
  flagClientOut: async (clientId, time) => {
    await db('client_service_status').where('client_id', clientId).del()
    await db('client_service_status').insert({ client_id: clientId, has_outage: true })
  },

  flagClientOk: async (clientId, time) => {
    await db('client_service_status').where('client_id', clientId).del()
    await db('client_service_status').insert({ client_id: clientId, has_outage: false })
  },
  clientHasOutage: async (clientId) => {
    const rows = await db('client_service_status').where('client_id', clientId)
    return rows.length > 0 && rows[0].has_outage
  }
}
