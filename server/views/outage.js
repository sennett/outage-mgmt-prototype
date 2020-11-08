const clientName = (client) => {
  const clientTypes = {
    INDIVIDUAL: 1,
    COMPANY: 2
  }

  if (client.clientType === clientTypes.COMPANY) {
    return `${client.companyName} (${client.companyContactFirstName} ${client.companyContactLastName})`
  } else {
    return `${client.firstName} ${client.lastName}`
  }
}

module.exports = (clientOutage) => {
  return {
    clientName: clientName(clientOutage.client)
  }
}
