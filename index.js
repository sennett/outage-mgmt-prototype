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
  fastify.post('/create-subscription', async (request, reply) => {
    return request.body
    // reply.code(200).send('actually did not create subscription')
  })

  fastify.get('/customer-data', async (request, reply) => {
    return [
      {
        id: '1',
        firstName: 'Tony Outage',
        hasOutage: true
      }, {
        id: '2',
        firstName: 'Mary No Outage',
        hasOutage: false
      }
    ]
  })

  await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
  logger.info(`running server on ${fastify.server.address().port}`)
}

outageDetection()

startServer()
