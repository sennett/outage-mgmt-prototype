const { TestScheduler } = require('rxjs/testing')
const clientWithOutageStream = require('./client-with-outage-stream')

const buildTestScheduler = () => new TestScheduler((recevied, expected) => {
  expect(recevied).toEqual(expected)
})

describe('client-with-outage-stream', () => {
  it('does not flag if client does not have an outage', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          firstName: 'Mary no outage',
          hasOutage: false
        }
      }
      const clientStream = cold('-a-', values)
      const expected = '         ---'
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected)
    })
  })

  it('does not flag if just one hasOutage', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Tony Outage',
          hasOutage: true
        }
      }
      const clientStream = cold('-a-----', values)
      const expected = '         -------'
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected)
    })
  })

  it('does not flag if hasOutage for 29 continuous seconds', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Tony Outage',
          hasOutage: true
        }
      }

      const clientStream = cold(`- ${'a 1s '.repeat(29)} ----`, values)
      const expected = `         - ${'- 1s '.repeat(29)} ----`
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected)
    })
  })

  it.todo('flags if hasOutage for 30 continuous seconds')
  it.todo('does not flag if !hasOutage for 30 continuous seconds')
  it.todo('does not flag if !hasOutage once in 35 seconds')
})
