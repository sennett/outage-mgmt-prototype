require('dotenv').config()
const outageDetection = require('./outage-detection')
const server = require('./server')

outageDetection()

server()
