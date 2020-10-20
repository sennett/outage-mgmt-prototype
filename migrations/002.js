module.exports = {
  up (knex) {
    return knex.schema
      .dropTable('push_subscriptions')
      .createTable('push_notification_subscriptions', (table) => {
        table.increments('id')
        table.json('subscription')
        table.datetime('created')
      })
  },
  down () {
    // blank
  }
}
