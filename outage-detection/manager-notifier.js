const logger = require('../logger')
const webpush = require('web-push')

let connected = false

let subscription

const notify = async (client) => {
  if (!connected) {
    webpush.setVapidDetails(process.env.VAPID_CONTACT, process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE)
    connected = true
  }
  logger.info('sending management message', { client, subscription })
  const result = await webpush.sendNotification(subscription, JSON.stringify(client))
  logger.info('sent management message', { client, subscription, result })
}

notify.setSubscription = (subs) => {
  subscription = subs
}

module.exports = notify
