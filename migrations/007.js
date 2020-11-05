module.exports = {
  up (knex) {
    return knex.schema
      .alterTable('client_service_status', (table) => {
        table.datetime('start')
        table.datetime('end')
      })
  },
  down () {
    // blank
  }
}
