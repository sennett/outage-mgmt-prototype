const winston = require('winston')

const logger = winston.createLogger({
  level: 'warn',
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

module.exports = logger
