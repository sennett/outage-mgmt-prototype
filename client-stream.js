const { timer, from } = require('rxjs')
const { mapTo, map, flatMap } = require('rxjs/operators')
const got = require('got')

module.exports = () => timer(0, 1000)
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
    flatMap(value => value),
    map(listOfClients => from(listOfClients)),
    flatMap(value => value)
  )
