const { filter } = require('rxjs/operators')

module.exports = (clientStream) => clientStream
  .pipe(
    filter(client => client.hasOutage)
  )
