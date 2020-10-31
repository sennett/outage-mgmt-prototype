module.exports = {
  up (knex) {
    return knex.schema
      .alterTable('push_notification_subscriptions', (table) => {
        table.datetime('expired')
      })
  },
  down () {
    // blank
  }
}
