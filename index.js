require('dotenv').config()
const app = require('./app')
const logger = require('./logger')

app()

const fastify = require('fastify')()

fastify.get('/keep-alive', async (request, reply) => {
  return 'running!'
})

const startServer = async () => {
  await fastify.listen(3000)
  logger.info(`running server on ${fastify.server.address().port}`)
}

startServer()
