const got = require('got')

module.exports = (client) => {
  console.log(`sending management message about ${client.firstName}`)
  got.post(`${process.env.MESSAGING_API}/send-message`, {
    json: client
  })
}
