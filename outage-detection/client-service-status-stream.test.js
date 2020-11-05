const { times, flatMap: _flatMap, isUndefined } = require('lodash')
const { from, of } = require('rxjs')
const { concatMap, delay } = require('rxjs/operators')
const { subDays } = require('date-fns')

describe('client-service-status-stream', () => {
  let clientServiceStatusStream
  let logger

  const executeTest = async (input) => {
    const timeBetweenEventsMs = 3
    input = from(input).pipe(
      concatMap(client => of(client).pipe(delay(isUndefined(client.delay) ? timeBetweenEventsMs : client.delay)))
    )

    const result = await (new Promise((resolve) => {
      const output = jest.fn()

      clientServiceStatusStream(input).subscribe({
        next: (client) => {
          output(client)
        },
        done: () => {
          fail('clientServiceStatusStream should not complete')
        },
        error: (err) => {
          fail(err)
        }
      })

      setTimeout(() => {
        resolve(output)
      }, 400)
    }))

    return result
  }

  let clientOutages
  beforeEach(() => {
    clientOutages = {}
    jest.setMock('./client-service-status-repository', {
      flagClientOk: jest.fn().mockImplementation((id, outageEndTime) => {
        clientOutages[id] = false
        clientOutages[`${id}_outageEndTime`] = outageEndTime
      }),
      flagClientOut: jest.fn().mockImplementation((id, outageStartTime) => {
        clientOutages[id] = outageStartTime || true
      }),
      clientHasOutage: jest.fn().mockImplementation((id) => {
        return [!!clientOutages[id]]
      })
    })

    jest.setMock('../logger', {
      warn: jest.fn()
    })

    clientServiceStatusStream = require('./client-service-status-stream')
    logger = require('../logger')
  })

  describe('basic cases', () => {
    it('does not flag if client does not have an outage', async () => {
      const noOutage = {
        id: 'client id',
        firstName: 'Mary no outage',
        hasOutage: false
      }

      const input = [noOutage]

      const result = await executeTest(input)

      expect(result).not.toHaveBeenCalled()
    })

    it('does not flag if just one hasOutage', async () => {
      const outage = {
        id: 'client_id',
        firstName: 'Tony Outage',
        hasOutage: true
      }

      const input = [outage]

      const result = await executeTest(input)

      expect(result).not.toHaveBeenCalled()
    })
  })

  describe('boundaries', () => {
    it('does not flag if hasOutage for less than the outage flagging time', async () => {
      const outage = {
        id: 'client_id',
        firstName: 'Tony Outage',
        hasOutage: true
      }

      const input = [
        ...times(29, () => outage)
      ]

      const result = await executeTest(input)

      expect(result).not.toHaveBeenCalled()
    })

    it('flags if hasOutage for the entire outage flagging time', async () => {
      const outage = {
        id: 'client_id',
        firstName: 'Tony Outage',
        hasOutage: true
      }

      const input = [
        ...times(30, () => outage)
      ]

      const result = await executeTest(input)

      expect(result).toHaveBeenCalledWith(expect.objectContaining(outage))
      expect(result).toHaveBeenCalledTimes(1)
    })

    it('does not flag if no outage for entire outage flagging time', async () => {
      const noOutage = {
        id: 'client_id',
        firstName: 'Mary No Outage',
        hasOutage: false
      }

      const input = [
        ...times(30, () => noOutage)
      ]

      const result = await executeTest(input)

      expect(result).not.toHaveBeenCalled()
    })

    it('does not flag as outage when not quite intermittent enough', async () => {
      const outage = {
        id: 'client_id',
        firstName: 'Mary Outage',
        hasOutage: true
      }

      const noOutage = {
        id: 'client_id',
        firstName: 'Mary No Outage',
        hasOutage: false
      }

      const input = [
        ...times(29, () => outage),
        ...times(60, () => noOutage),
        ...times(29, () => outage)
      ]

      const result = await executeTest(input)

      expect(result).not.toHaveBeenCalled()
    })
  })

  it('notices when client starts outputting outage again after recovery', async () => {
    expect.assertions(4)

    const outage = {
      id: 'client_id 1',
      firstName: 'Tony Outage',
      hasOutage: true
    }
    const noOutage = {
      id: 'client_id 1',
      firstName: 'Tony No Outage',
      hasOutage: false

    }

    const input = [
      ...times(30, () => outage),
      ...times(30, () => noOutage),
      ...times(30, () => outage)
    ]

    const result = await executeTest(input)

    expect(result).toHaveBeenCalledTimes(3)
    expect(result.mock.calls[0][0]).toEqual(expect.objectContaining(outage))
    expect(result.mock.calls[1][0]).toEqual(expect.objectContaining(noOutage))
    expect(result.mock.calls[2][0]).toEqual(expect.objectContaining(outage))
  })

  describe('handling multiple clients', () => {
    it('handles two clients one outage', async () => {
      const outage = {
        id: 'client_id',
        firstName: 'Tony Outage',
        hasOutage: true,
        delay: 0
      }
      const noOutage = {
        id: 'client_id two',
        firstName: 'Mary No Outage',
        hasOutage: false
      }

      const input = _flatMap(times(30, () => [outage, noOutage]))

      const result = await executeTest(input)

      expect(result).toHaveBeenCalledTimes(1)
      expect(result).toHaveBeenCalledWith(expect.objectContaining(outage))
      expect(result).not.toHaveBeenCalledWith(expect.objectContaining(noOutage))
    })

    it('handles two clients two outages', async () => {
      const outage = {
        id: 'client_id',
        firstName: 'Tony Outage',
        hasOutage: true,
        delay: 0
      }
      const noOutage = {
        id: 'client_id two',
        firstName: 'Mary Outage',
        hasOutage: true
      }

      const input = _flatMap(times(30, () => [outage, noOutage]))

      const result = await executeTest(input)

      expect(result).toHaveBeenCalledTimes(2)
      expect(result).toHaveBeenCalledWith(expect.objectContaining(outage))
      expect(result).toHaveBeenCalledWith(expect.objectContaining(noOutage))
    })
  })

  describe('behaviour across service restarts', () => {
    it('notifies correctly when client goes out-ok-restart-out', async () => {
      expect.assertions(5)

      const outagePreRestart = {
        id: 'client id out-ok-restart-out',
        firstName: 'Tony outage',
        hasOutage: true
      }
      const noOutage = {
        id: 'client id out-ok-restart-out',
        firstName: 'Tony no outage',
        hasOutage: false
      }
      const outagePostRestart = {
        id: 'client id out-ok-restart-out',
        firstName: 'Tony Outage new outage',
        hasOutage: true
      }

      const inputPreRestart = [
        ...times(30, () => outagePreRestart),
        ...times(30, () => noOutage)
      ]

      const outputPreRestart = await executeTest(inputPreRestart)

      expect(outputPreRestart).toHaveBeenCalledTimes(2)
      expect(outputPreRestart.mock.calls[0][0]).toEqual(expect.objectContaining(outagePreRestart))
      expect(outputPreRestart.mock.calls[1][0]).toEqual(expect.objectContaining(noOutage))

      const inputPostRestart = [
        ...times(30, () => outagePostRestart)
      ]

      const outputPostRestart = await executeTest(inputPostRestart)

      expect(outputPostRestart).toHaveBeenCalledWith(expect.objectContaining(outagePostRestart))
      expect(outputPostRestart).toHaveBeenCalledTimes(1)
    })

    it('remembers the client is out across service restarts', async () => {
      const outage = {
        id: 'client id across service restarts',
        firstName: 'Tony Outage',
        hasOutage: true
      }

      const inputPreRestart = [
        ...times(30, () => outage)
      ]

      const outputPreRestart = await executeTest(inputPreRestart)

      expect(outputPreRestart).toHaveBeenCalledWith(outage)
      expect(outputPreRestart).toHaveBeenCalledTimes(1)

      const inputPostRestart = [
        ...times(30, () => outage)
      ]

      const outputPostRestart = await executeTest(inputPostRestart)

      expect(outputPostRestart).not.toHaveBeenCalled()
    })

    it.todo('remembers that client is ok across service restarts')
  })

  it('gracefully handles missing client.id', async () => {
    const noId = {
      firstName: 'Tony Outage',
      hasOutage: true
    }
    const undefinedId = {
      id: undefined,
      firstName: 'Tony Outage',
      hasOutage: true
    }
    const emptyId = {
      id: '',
      firstName: 'Tony Outage',
      hasOutage: true
    }

    const input = [noId, undefinedId, emptyId]

    const result = await executeTest(input)

    expect(result).not.toHaveBeenCalled()

    expect(logger.warn).toHaveBeenCalledWith('no id found for client', expect.objectContaining(noId))
    expect(logger.warn).toHaveBeenCalledWith('no id found for client', expect.objectContaining(undefinedId))
    expect(logger.warn).toHaveBeenCalledWith('no id found for client', expect.objectContaining(emptyId))
  })

  it('updates the database with the outage information', async () => {
    expect.assertions(2)
    let outageTime = new Date(Date.now())
    outageTime = subDays(outageTime, 2)
    const outageInformation = times(30, () => ({
      id: 'client_id',
      firstName: 'Tony Outage',
      hasOutage: true,
      retrievedAt: outageTime
    }))

    await executeTest(outageInformation)

    expect(clientOutages.client_id).toEqual(outageTime)

    let uppageTime = new Date(Date.now())
    uppageTime = subDays(uppageTime, 2)
    const uppageInformation = times(30, () => ({
      id: 'client_id',
      firstName: 'Tony Outage',
      hasOutage: false,
      retrievedAt: uppageTime
    }))

    await executeTest(uppageInformation)

    expect(clientOutages.client_id_outageEndTime).toEqual(uppageTime)
  })
})
