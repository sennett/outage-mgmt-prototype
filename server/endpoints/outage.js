const db = require('../../db')
const outageViewModel = require('../views/outage')

module.exports = (fastify) => fastify.get('/outage/:id', async (request, reply) => {
  const outage = await db('client_service_status').where({ id: request.params.id }).first()
  if (!outage) {
    reply.code(404).send()
    return
  }
  const vm = outageViewModel(outage)
  reply.view('outage', vm)
})
