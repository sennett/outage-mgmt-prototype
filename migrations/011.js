module.exports = {
  up (knex) {
    return knex.schema.alterTable('client_service_status', (table) => {
      table.json('client')
    })
  },
  down () {
    // blank
  }
}
