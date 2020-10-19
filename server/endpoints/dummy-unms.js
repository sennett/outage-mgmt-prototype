const fs = require('fs')
const util = require('util')
const readFile = util.promisify(fs.readFile)
const path = require('path')

module.exports = (fastify) => fastify.get('/dummy-unms', async (request, reply) => {
  const dummyResponse = await readFile(path.join(__dirname, 'dummy-unms.json'))
  reply.code(200).send(dummyResponse)
})
