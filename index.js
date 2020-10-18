require('dotenv').config()
const outageDetection = require('./outage-detection')
const logger = require('./logger')

outageDetection()

const fastify = require('fastify')()

fastify.get('/keep-alive', async (request, reply) => {
  return 'running!'
})

const startServer = async () => {
  await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
  logger.info(`running server on ${fastify.server.address().port}`)
}

startServer()
