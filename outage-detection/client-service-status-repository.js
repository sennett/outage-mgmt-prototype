const db = require('../db')

const clientHasOutage = async (clientId) => {
  const rows = await db('client_service_status').where({
    client_id: clientId,
    end: null
  })

  return rows.length > 0
}

module.exports = {
  clientHasOutage,

  flagClientOk: async (clientId, endTime) => {
    const hasOutage = await clientHasOutage(clientId)
    if (!hasOutage) {
      throw new Error(`attempted to flag client ${clientId} as ok, but they do not currently have an outage in the DB. ignoring.`)
    }

    await db('client_service_status').where({
      client_id: clientId,
      end: null
    }).update({ end: endTime })
  },

  flagClientOut: async (clientId, startTime) => {
    const hasOutage = await clientHasOutage(clientId)
    if (hasOutage) {
      throw new Error(`attempted to flag client ${clientId} as out, but they currently have an outage in the DB. ignoring.`)
    }

    await db('client_service_status').insert({ client_id: clientId, start: startTime })
  }
}
