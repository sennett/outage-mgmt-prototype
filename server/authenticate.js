const logger = require('../logger')
const basicAuth = require('basic-auth')

module.exports = (fastifyInstance) => {
  fastifyInstance.addHook('preHandler', async (request, reply) => {
    const credentials = basicAuth(request)
    if (!credentials) {
      logger.warn('not authorised')
      await reply.header('WWW-Authenticate', 'Basic').code(401).send('not authorised')
    } else if (credentials.name !== 'anthony' || credentials.pass !== 'pass') {
      logger.warn('not authorised')
      await reply.header('WWW-Authenticate', 'Basic').code(401).send('not authorised')
    }
  })
}
