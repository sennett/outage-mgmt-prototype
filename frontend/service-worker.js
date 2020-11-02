/* globals self, clients */

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('push', async function (event) {
  const baseUrl = self.registration.scope // includes trailing /
  const client = event.data.json()
  const title = `Outage for ${client.firstName} ${client.lastName}`
  const options = {
    body: 'Click to open UNMS and see what\'s up.',
    data: { client },
    tag: client.id,
    requireInteraction: true,
    image: `${baseUrl}internet-down.png`,
    icon: `${baseUrl}internet-down.png`,
    badge: `${baseUrl}internet-down.png`
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', async function (event) {
  event.notification.close()
  await clients.openWindow(`https://portal.valewisp.com/crm/client/${event.notification.data.client.id}`)
}, false)
