const got = require('got')
const logger = require('./logger')

module.exports = (client) => {
  logger.info(`sending management message about ${client.firstName}`)
  got.post(`${process.env.MESSAGING_API}/send-message`, {
    json: client
  })
}
