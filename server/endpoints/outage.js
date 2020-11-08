const serviceStatusRespository = require('../../outage-detection/client-service-status-repository')
const outageViewModel = require('../views/outage')
const logger = require('../../logger')

module.exports = (fastify) => fastify.get('/outage/:id', async (request, reply) => {
  try {
    const outage = await serviceStatusRespository.loadById(request.params.id)
    const vm = outageViewModel(outage)
    reply.view('outage', vm)
  } catch (error) {
    logger.warn('could not load outage. req params:', request.params)
    logger.warn('could not load outage. error:', error)
    reply.code(404).send()
  }
})
