require('dotenv').config()
const outageDetection = require('./outage-detection')
const server = require('./server')
const db = require('./db')

db.migrate.latest()

outageDetection()

server()
