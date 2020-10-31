const fs = require('fs')
const path = require('path')
const logger = require('../logger')

let serverConf = {}

if (process.env.NODE_ENV === 'development') {
  serverConf = {
    https: {
      key: fs.readFileSync(path.join(__dirname, 'ssl/localhost.key')),
      cert: fs.readFileSync(path.join(__dirname, 'ssl/localhost.crt'))
    }
  }
}

const fastify = require('fastify')(serverConf)

fastify.setErrorHandler((error, request, reply) => {
  logger.error('error in http request', error)
})

fastify.register(async (instance, opts) => {
  require('./authenticate')(instance)

  require('./endpoints/static-site')(instance)
  require('./endpoints/create-subscription')(instance)
})

require('./endpoints/keep-alive')(fastify)

if (process.env.NODE_ENV === 'development') {
  require('./endpoints/dummy-unms')(fastify)
}

module.exports = async () => {
  await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
  logger.info(`running server on ${fastify.server.address().port}`)
}
