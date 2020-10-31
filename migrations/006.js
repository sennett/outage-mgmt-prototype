module.exports = {
  up (knex) {
    return knex.schema
      .createTable('client_service_status', (table) => {
        table.increments('id')
        table.string('client_id').notNullable()
        table.boolean('has_outage')
        table.index(['client_id', 'has_outage'])
      })
  },
  down () {
    // blank
  }
}
