require('dotenv').config()
const continuousClientWithOutageStream = require('./continuous-client-with-outage-stream')
const clientStream = require('./client-stream')

continuousClientWithOutageStream(clientStream()).subscribe(client => {
  console.log(client.firstName)
})
