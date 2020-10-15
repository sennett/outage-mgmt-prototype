const { from, timer } = require('rxjs')
const { map, flatMap } = require('rxjs/operators')
const got = require('got')

const request = () => from(got(`${process.env.CRM_API}/v1.0/clients`, {
  headers: {
    Accept: 'application/json',
    'x-auth-token': process.env.CRM_API_KEY
  },
  searchParams: {
    isArchived: 0,
    lead: 0
  }
}
)).pipe(map(response => {
  console.log('queried server')
  return JSON.parse(response.body)
}))

module.exports = () => timer(0, 1000)
  .pipe(
    flatMap(request),
    flatMap(listOfClients => from(listOfClients))
  )
