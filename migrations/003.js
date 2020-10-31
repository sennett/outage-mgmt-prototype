module.exports = {
  up (knex) {
    return knex.schema
      .dropTable('push_notification_subscriptions')
      .createTable('push_notification_subscriptions', (table) => {
        table.increments('id')
        table.json('subscription').notNullable()
        table.datetime('created').notNullable()
      })
  },
  down () {
    // blank
  }
}
