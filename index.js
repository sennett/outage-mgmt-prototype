require('dotenv').config()
const clientWithOutageStream = require('./client-with-outage-stream')
const clientStream = require('./client-stream')

clientWithOutageStream(clientStream()).subscribe(client => {
  console.log(client.firstName)
})
