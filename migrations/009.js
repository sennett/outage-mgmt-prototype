module.exports = {
  up (knex) {
    return knex.schema.alterTable('client_service_status', (table) => {
      table.dropColumn('has_outage')
    })
  },
  down () {
    // blank
  }
}
