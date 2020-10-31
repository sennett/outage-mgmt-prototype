const db = require('../../db')
const logger = require('../../logger')

module.exports = (fastify) => fastify.post('/create-subscription', async (request, reply) => {
  await db('push_notification_subscriptions').insert({
    subscription: request.body
  })
  logger.info('saved subscription', request.body)
  return reply.code(200).send(request.body)
})
