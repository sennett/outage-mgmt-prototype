require('dotenv').config({ path: './.env.test' })
const db = require('./db')

module.exports = async () => {
  global.db = db
  await db.migrate.latest()
}
