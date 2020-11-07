module.exports = (clientOutage) => {
  return {
    clientName: clientOutage.client.firstName + ' ' + clientOutage.client.lastName
  }
}
