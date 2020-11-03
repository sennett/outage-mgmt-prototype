module.exports = {
  async up (knex) {
    const start = new Date(Date.now())
    start.setDate(start.getDate() - 2)
    await knex('client_service_status').update({
      start
    })

    const end = new Date(Date.now())
    end.setDate(end.getDate() - 1)
    await knex('client_service_status').where({ has_outage: false }).update({
      end
    })
  },
  down () {
    // blank
  }
}
