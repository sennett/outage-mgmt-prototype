const { bufferWhen, tap, map, merge, takeUntil, mergeAll, delay, count, filter, mapTo } = require('rxjs/operators')
const { interval, of } = require('rxjs')

// const clicks = interval(5000).pipe(tap((value) => { console.log(`clicks emitting ${value}`) }))
// const buffered = clicks.pipe(bufferWhen(() => {
//   console.log('creating flusher')
//   return interval(1000).pipe(tap(() => console.log('fluher emitting')))
// }
// ))
// buffered.subscribe(x => {
//   console.log('buffered emitting')
//   console.log(x)
// })

const source = interval(1000)

const higherOrderObservable = source.pipe(
  map(v => of(v).pipe( // on each value, create new stream with the value first
    merge(source), // add subsequent values to stream
    takeUntil(of('anything').pipe(delay(5000))), // only take the first 5 seconds of values
    count(), // count total emitted values before stream closes
    filter(count => count > 4), // only include streams with more than 4 values.
    mapTo(v) // actually return the first value instead
  ))
)

higherOrderObservable.pipe(mergeAll()).subscribe(v => {
  console.log('----------------')
  console.log(v)
})
