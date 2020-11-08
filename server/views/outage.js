const { formatRelative, formatDistance, format } = require('date-fns')
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

const summaryRows = (clientOutage) => {
  const rows = []
  if (clientOutage.end) {
    rows.push(`ℹ️ Outage time: ${formatDistance(clientOutage.start, clientOutage.end)}`)
    rows.push(`✅ Recovered ${formatRelative(clientOutage.end, new Date(Date.now()))}`)
  }
  rows.push(`⛔️ Outage from ${formatRelative(clientOutage.start, new Date(Date.now()))}`)

  return rows
}

const ICON_UP = '/static-assets/internet-ok.png'
const ICON_DOWN = '/static-assets/internet-down.png'

const copyableMessage = (clientOutage) => {
  if (clientOutage.end) {
    return `Update ${format(Date.now(), 'HH:mm')}: The issue has been fixed and service was restored at ${format(clientOutage.end, 'HH:mm')}.  Thanks for your understanding.`
  } else {
    return `${format(Date.now(), 'HH:mm')}: We detected some intermittent connectivity issues from ${format(clientOutage.start, 'HH:mm')}. We're currently investigating.`
  }
}

module.exports = (clientOutage) => {
  return {
    clientName: clientName(clientOutage.client),
    iconSrc: clientOutage.end ? ICON_UP : ICON_DOWN,
    summaryRows: summaryRows(clientOutage),
    copyableMessage: copyableMessage(clientOutage)
  }
}
