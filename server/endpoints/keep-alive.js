module.exports = (fastify) => fastify.get('/keep-alive', async (request, reply) => {
  return 'running!'
})
