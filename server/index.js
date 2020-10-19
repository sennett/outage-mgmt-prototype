const logger = require('../logger')

const fastify = require('fastify')()

const startServer = async () => {
  require('./endpoints/static-site')(fastify)
  require('./endpoints/keep-alive')(fastify)
  require('./endpoints/create-subscription')(fastify)

  if (process.env.NODE_ENV === 'development') {
    require('./endpoints/dummy-unms')(fastify)
  }

  await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
  logger.info(`running server on ${fastify.server.address().port}`)
}

module.exports = startServer
