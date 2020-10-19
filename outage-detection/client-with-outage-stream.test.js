const { TestScheduler } = require('rxjs/testing')
const clientWithOutageStream = require('./client-with-outage-stream')
const logger = require('../logger')

jest.mock('../logger.js')

const buildTestScheduler = () => new TestScheduler((received, expected) => {
  expect(received).toEqual(expected)
})

describe('client-with-outage-stream', () => {
  it('does not flag if client does not have an outage', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
      const values = {
        a: {
          firstName: 'Mary no outage',
          hasOutage: false
        }
      }
      const clientStream = hot('-a-', values)
      const expected = '        ---'
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected)
    })
  })

  it('does not flag if just one hasOutage', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Tony Outage',
          hasOutage: true
        }
      }
      const clientStream = hot('-a-----', values)
      const expected = '        -------'
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected)
    })
  })

  it('does not flag if hasOutage for 29 continuous seconds', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Tony Outage',
          hasOutage: true
        }
      }

      const clientStream = hot(`- ${'a 1s '.repeat(29)} ----`, values)
      const expected = `        - ${'- 1s '.repeat(29)} ----`
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected)
    })
  })

  it('flags if hasOutage for 30 continuous seconds', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Tony Outage',
          hasOutage: true
        }
      }

      const clientStream = hot(`- ${'a 1s '.repeat(29)} a---`, values)
      const expected = `        - ${'- 1s '.repeat(29)} 971ms a---`
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })

  it('does not flag if !hasOutage for 30 continuous seconds', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Mary No Outage',
          hasOutage: false
        }
      }

      const clientStream = hot(`- ${'a 1s '.repeat(40)} ---`, values)
      const expected = `        - ${'- 1s '.repeat(40)} ---` // go a bit higher with the sample time
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })

  it('does not flag as outage when not quite intermittent enough', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
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

      const clientStream = hot(`- ${'a 1s '.repeat(29)} b 1s ${'a 1s '.repeat(29)} ---`, values)
      const expected = `        - ${'- 1s '.repeat(29)} - 1s ${'- 1s '.repeat(29)} ---`
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })

  it('flags as outage when intermittent', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
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

      const clientStream = hot(`- ${'a 1s '.repeat(29)} b 1s ${'a 1s '.repeat(30)} ---`, values)
      const expected = `        - ${'- 1s '.repeat(29)} - 1s ${'- 1s '.repeat(29)} 971ms a--`
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })

  it('handles two clients at once', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
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

      const clientStream = hot(`- ${'ab 998ms '.repeat(30)} ---`, values)
      const expected = `        - ${'   1s    '.repeat(30)} a--`
      expectObservable(clientWithOutageStream(clientStream)).toBe(expected, values)
    })
  })

  it('does not continuously flag client as having outages', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id',
          firstName: 'Tony Outage',
          hasOutage: true
        }
      }

      const continuousClientStream = hot(`- ${'a 999ms '.repeat(30)} a 999ms ${'a 999ms '.repeat(10)}`, values)
      const expected = `                  - ${'1s      '.repeat(30)} a 999ms ${'1s      '.repeat(10)}`
      expectObservable(clientWithOutageStream(continuousClientStream)).toBe(expected, values)
    })
  })

  it('handles multiple clients concurrently', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
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

      const continuousClientStream = hot(`- ${'a 999ms '.repeat(15)} ${'(ab) 996ms '.repeat(15)} ${'b 999ms '.repeat(15)} ${'b 999ms '.repeat(15)}`, values)
      const expected = '                  -                        30s                          a 999ms       14s        b 999ms 14s               '
      expectObservable(clientWithOutageStream(continuousClientStream)).toBe(expected, values)
    })
  })

  it('notices when client starts outputting outage again after recovery', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
      const values = {
        a: {
          id: 'client_id 1',
          firstName: 'Tony Outage',
          hasOutage: true
        },
        b: {
          id: 'client_id 1',
          firstName: 'Tony No Outage',
          hasOutage: false
        }
      }

      const continuousClientStream = hot(`- ${'a 999ms '.repeat(30)} ${'b 999ms '.repeat(30)} ${'a 999ms '.repeat(30)}     40s     -`, values)
      const expected = '                  -            30s          a 999ms 29s                      30s               a 999ms 39s -'
      expectObservable(clientWithOutageStream(continuousClientStream)).toBe(expected, values)
    })
  })

  it('gracefully handles missing client.id', () => {
    buildTestScheduler().run(({ hot, expectObservable }) => {
      const values = {
        a: {
          firstName: 'Tony Outage',
          hasOutage: true
        },
        b: {
          id: undefined,
          firstName: 'Tony Outage',
          hasOutage: true
        },
        c: {
          id: '',
          firstName: 'Tony Outage',
          hasOutage: true
        }
      }

      const continuousClientStream = hot(`- ${'abc 997ms '.repeat(35)} -`, values)
      const expected = '                  -            35s             -'
      expectObservable(clientWithOutageStream(continuousClientStream)).toBe(expected, values)
      // expect(logger.warn).toHaveBeenCalledWith('no id found for client', expect.objectContaining(values.a))
      // expect(logger.warn).toHaveBeenCalledWith('no id found for client', expect.objectContaining(values.b))
      // expect(logger.warn).toHaveBeenCalledWith('no id found for client', expect.objectContaining(values.c))
    })
  })
})
