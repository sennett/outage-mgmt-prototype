const { TestScheduler } = require('rxjs/testing')
const clientWithOutageStream = require('./client-with-outage-stream')

const buildTestScheduler = () => new TestScheduler((received, expected) => {
  expect(received).toEqual(expected)
})

describe('client-with-outage-stream', () => {
  it('does not continuously flag one client as having outages', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Tony Outage',
          hasOutage: true
        }
      }

      const continuousClientStream = cold(`- a 1s ${'a 1s '.repeat(10)} - `, values)
      const expected = `                   - a 1s ${'- 1s '.repeat(10)} - `
      expectObservable(clientWithOutageStream(continuousClientStream)).toBe(expected, values)
    })
  })

  it('handles multiple clients concurrently', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id 1',
          firstName: 'Tony Outage',
          hasOutage: true
        },
        b: {
          id: 'client_id 2',
          firstName: 'Mary Outage',
          hasOutage: true
        }
      }

      const continuousClientStream = cold('- a 1s b 1s a 1s a 1s b 1s b 1s - ', values)
      const expected = '                   - a 1s b 1s - 1s - 1s - 1s - 1s - '
      expectObservable(clientWithOutageStream(continuousClientStream)).toBe(expected, values)
    })
  })
})
