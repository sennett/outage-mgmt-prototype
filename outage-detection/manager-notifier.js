const logger = require('../logger')
const webpush = require('web-push')

const subscription = { endpoint: 'https://fcm.googleapis.com/fcm/send/c03R4XubdVw:APA91bHqAefZbD-rAvwUhEAqPwmQrnUPh5hxB3pQnebVoEvwK_y12Y_Z03UjMp7FfvFhVZ3vi1Hcyh0B-0vr-fgDtLRg4mbc2yngO5n-NTOhEkxtGhhIZ76UKmVkr63DtRzEpN06Xueq', expirationTime: null, keys: { p256dh: 'BE2in74vfcGB0FzB5V4YxIZSnsREZ_4m9XEFPY2uvdQNhTpvY2tcq_moHWvZDWpv6nbrTJpYwx1co4Ru8d3D1nI', auth: 'nIFofII88DSA5b7KXW9hxg' } }
let connected = false

module.exports = async (client) => {
  if (!connected) {
    webpush.setVapidDetails(process.env.VAPID_CONTACT, process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE)
    connected = true
  }
  logger.info(`sending management message about ${client.firstName}`)
  const result = await webpush.sendNotification(subscription, `${client.firstName} is down!`)
  logger.info('sent management message.  result: ', result)
}
