require('dotenv').config()
const clientWithOutageStream = require('./client-with-outage-stream')

const subscription = clientWithOutageStream().subscribe(client => {
  console.log(client.firstName)
})

setTimeout(() => subscription.unsubscribe(), 5000)
