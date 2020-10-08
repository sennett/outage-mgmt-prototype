const { TestScheduler } = require('rxjs/testing')
const clientWithOutageStream = require('./client-with-outage-stream')

const buildTestScheduler = () => new TestScheduler((received, expected) => {
  expect(received).toEqual(expected)
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

  it('flags if hasOutage for 30 continuous seconds', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Tony Outage',
          hasOutage: true
        }
      }

      const clientStream = cold(`- ${'a 1s '.repeat(29)} a---`, values)
      const expected = `         - ${'- 1s '.repeat(29)} 971ms a---`
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })

  it('does not flag if !hasOutage for 30 continuous seconds', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Mary No Outage',
          hasOutage: false
        }
      }

      const clientStream = cold(`- ${'a 1s '.repeat(32)} ---`, values)
      const expected = `         - ${'- 1s '.repeat(32)} ---` // go a bit higher with the sample time
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })

  it('does not flag as outage when not quite intermittent enough', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Mary No Outage',
          hasOutage: true
        },
        b: {
          id: 'client_id',
          firstName: 'Mary No Outage',
          hasOutage: false
        }
      }

      const clientStream = cold(`- ${'a 1s '.repeat(29)} b 1s ${'a 1s '.repeat(29)} ---`, values)
      const expected = `         - ${'- 1s '.repeat(29)} - 1s ${'- 1s '.repeat(29)} ---`
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })

  it('flags as outage when intermittent', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Mary No Outage',
          hasOutage: true
        },
        b: {
          id: 'client_id',
          firstName: 'Mary No Outage',
          hasOutage: false
        }
      }

      const clientStream = cold(`- ${'a 1s '.repeat(29)} b 1s ${'a 1s '.repeat(30)} ---`, values)
      const expected = `         - ${'- 1s '.repeat(29)} - 1s ${'- 1s '.repeat(29)} 971ms a--`
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })

  it('handles two clients at once', () => {
    buildTestScheduler().run(({ cold, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Tony Outage',
          hasOutage: true
        },
        b: {
          id: 'client_id',
          firstName: 'Mary No Outage',
          hasOutage: false
        }
      }

      const clientStream = cold(`- ${'ab 1s '.repeat(30)} ---`, values)
      const expected = `         - ${'   1s '.repeat(30)} a--`
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })

  it('does not continuously flag clients as having outages', () => {
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
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })
})
