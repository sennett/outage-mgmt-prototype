const logger = require('../../logger')
const managerNotifier = require('../../outage-detection/manager-notifier')

module.exports = (fastify) => fastify.post('/create-subscription', async (request, reply) => {
  logger.warn('did not actually create subscription')
  await managerNotifier.setSubscription(request.body)
  return reply.code(200).send('subscription saved')
})
