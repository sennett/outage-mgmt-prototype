require('dotenv').config()
const app = require('./app')
const logger = require('./logger')

app()

const fastify = require('fastify')()

fastify.get('/keep-alive', async (request, reply) => {
  return 'running!'
})

const startServer = async () => {
  await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
  logger.info(`running server on ${fastify.server.address().port}`)
}

startServer()
