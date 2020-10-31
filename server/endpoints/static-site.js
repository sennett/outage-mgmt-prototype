const path = require('path')
const fastifyStatic = require('fastify-static')

module.exports = (fastify) => fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../../frontend')
})
