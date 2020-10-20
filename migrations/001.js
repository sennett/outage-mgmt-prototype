module.exports = {
  up (knex) {
    return knex.schema
      .createTable('push_subscriptions', function (table) {
        table.increments('id')
        table.string('first_name', 255).notNullable()
        table.string('last_name', 255).notNullable()
      })
  },
  down () {
    // blank
  }
}
