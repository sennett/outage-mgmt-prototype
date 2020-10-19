require('dotenv').config()
const path = require('path')
const fastify = require('fastify')()
const fastifyStatic = require('fastify-static')
const outageDetection = require('./outage-detection')
const logger = require('./logger')
const managerNotifier = require('./outage-detection/manager-notifier')

const startServer = async () => {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'frontend')
  })
  fastify.get('/keep-alive', async (request, reply) => {
    return 'running!'
  })
  fastify.post('/create-subscription', async (request, reply) => {
    logger.warn('did not actually create subscription')
    await managerNotifier.setSubscription(request.body)
    return reply.code(200).send('subscription saved')
  })

  fastify.get('/send-notif', async (request, reply) => {
    logger.warn('sending notif')
    await managerNotifier({
      id: '1',
      firstName: 'Tony Outage',
      hasOutage: true
    })
    reply.code(200).send('message sent')
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
