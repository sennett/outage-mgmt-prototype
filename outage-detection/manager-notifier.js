const logger = require('../logger')
const webpush = require('web-push')
const db = require('../db')
const { from, empty } = require('rxjs')
const { flatMap, map, count, tap, catchError } = require('rxjs/operators')

let connected = false

const notify = async (client) => {
  if (!connected) {
    webpush.setVapidDetails(process.env.VAPID_CONTACT, process.env.VAPID_PUBLIC, process.env.VAPID_PRIVATE)
    connected = true
  }
  const clientString = JSON.stringify(client)
  from(db.select(['subscription', 'id']).whereNull('expired').from('push_notification_subscriptions')).pipe(
    flatMap(rows => from(rows)),
    flatMap(row =>
      from(webpush.sendNotification(row.subscription, clientString)).pipe(
        catchError(async err => {
          logger.info('issue with subscription - expiring', { subscription: row.subscription, err })
          db('push_notification_subscriptions').where('id', row.id).update({
            expired: db.fn.now()
          }).catch(err => console.warn('error expiring notification', err))
          return empty()
        })
      )),
    count()
  ).subscribe({
    next: (count) => {
      logger.info(`sent client to ${count} subscriptions`, { client })
    },
    error: (error) => logger.warn(error)
  })
}

module.exports = notify
