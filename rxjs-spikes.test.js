const { TestScheduler } = require('rxjs/testing')
const { groupBy, flatMap, map, scan, filter, delay, merge, takeUntil, count, mapTo, mergeAll } = require('rxjs/operators')
const { of } = require('rxjs')

const getTestScheduler = () => (new TestScheduler((received, expected) => {
  console.log(received)
  expect(received).toEqual(expected)
}))

describe('rxjs spikes', () => {
  it('runs a simple marbles test', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const source = cold('-a-b-c-')
      const expected = '   -a-b-c-'
      expectObservable(source).toBe(expected)
    })
  })

  it('grouping things', () => {
    getTestScheduler().run(({ cold, expectObservable }) => {
      const source = cold('-1-2-3-4-5-')
      const expected = '   -1-2-4-6-9-'
      const received = source.pipe(
        groupBy(v => v % 2),
        map(div2Stream => div2Stream
          .pipe(
            scan((acc, cur) => acc + parseInt(cur), 0),
            map(v => v.toString()))),
        flatMap(v => v)
      )
      expectObservable(received).toBe(expected)
    })
  })
  it('emits events that only happen three times within 5 ms', () => {
    // example of emitting events that happen three times within 5 ms.
    // creates a new stream for each emitted value, and counts emitted
    // values for 5ms.  could be improved by emitting immediately after
    // the three values are found.
    const testScheduler = getTestScheduler()
    testScheduler.run(({ cold, hot, expectObservable }) => {
      const source = hot('aaa--bbb--cc-dd-eee---fff--ggghhh----ababab--cdcdc--d-|')
      const expected = '  -----a----b----------e-----f----g--h------ab------c---|'

      const received = source.pipe(
        map(v => of(v).pipe(
          merge(source),
          takeUntil(of('anything').pipe(delay(5, testScheduler))),
          count(sourceValue => sourceValue === v),
          filter(count => count >= 3),
          mapTo(v)
        )),
        mergeAll()
      )

      expectObservable(received).toBe(expected)
    })
  })

  it.only('does it output these initial source values twice?', () => {
    getTestScheduler().run(({ cold, hot, expectObservable }) => {
      const source = hot('-a-b-c-')
      const expected = '   -a-b-c-'

      const received = source.pipe(
        flatMap(v => of(`${v} - parent:${v}`).pipe(
          merge(source.pipe(map(w => `${w} - parent:${v}`)))))
      )

      expectObservable(received).toBe(expected)
    })
  })
})
