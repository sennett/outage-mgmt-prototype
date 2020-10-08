const { TestScheduler } = require('rxjs/testing')

const buildTestScheduler = () => new TestScheduler((received, expected) => {
  expect(received).toEqual(expected)
})

describe('client-with-outage-stream', () => {
  xit('does not continuously flag clients as having outages', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Tony Outage',
          hasOutage: true
        }
      }

      const clientStream = cold(`- ${'a 1s '.repeat(30)} - ${'a 1s '.repeat(5)}`, values)
      const expected = `         - ${'- 1s '.repeat(30)} a ${'- 1s '.repeat(5)}`
      expectObservable(continuousClientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })
})
