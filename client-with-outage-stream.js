const { distinctUntilChanged, groupBy, flatMap } = require('rxjs/operators')

module.exports = (continuousClientStream) => continuousClientStream.pipe(
  groupBy(client => client.id),
  flatMap(client$ => client$.pipe(
    distinctUntilChanged((p, q) => p.id === q.id && p.hasOutage === q.hasOutage)
  ))
)
