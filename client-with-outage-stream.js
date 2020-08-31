const { timer, from } = require('rxjs')
const { mapTo, map, flatMap, filter } = require('rxjs/operators')
const got = require('got')

module.exports = () => {
  const clientResponseStream = timer(0, 1000)
    .pipe(
      mapTo(from(got(`${process.env.CRM_DOMAIN}/crm/api/v1.0/clients`, {
        headers: {
          Accept: 'application/json',
          'x-auth-token': process.env.CRM_API_KEY
        },
        searchParams: {
          isArchived: 0,
          lead: 0
        }
      }))
        .pipe(map(response => JSON.parse(response.body)))),
      flatMap(value => value)
    )

  const clientWithOutageStream = clientResponseStream
    .pipe(
      map(listOfClients => from(listOfClients)),
      flatMap(value => value),
      filter(client => client.hasOutage)
    )

  return clientWithOutageStream
}
