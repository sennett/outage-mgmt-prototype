module.exports = {
  up (knex) {
    return knex.schema
      .alterTable('push_notification_subscriptions', (table) => {
        table.datetime('created').notNullable().default(knex.fn.now()).alter()
      })
  },
  down () {
    // blank
  }
}
