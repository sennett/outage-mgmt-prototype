require('dotenv').config()
const path = require('path')
const fastify = require('fastify')()
const fastifyStatic = require('fastify-static')
const outageDetection = require('./outage-detection')
const logger = require('./logger')

const startServer = async () => {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'frontend')
  })
  fastify.get('/keep-alive', async (request, reply) => {
    return 'running!'
  })
  await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
  logger.info(`running server on ${fastify.server.address().port}`)
}

outageDetection()

startServer()
