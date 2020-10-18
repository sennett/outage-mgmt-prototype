const logger = require('../logger')

module.exports = (client) => {
  logger.info(`sending management message about ${client.firstName}`)
}
