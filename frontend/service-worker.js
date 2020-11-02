/* globals self, clients */

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('push', async function (event) {
  const notification = event.data.json()
  event.waitUntil(self.registration.showNotification(notification.title, notification.options))
})

self.addEventListener('notificationclick', async function (event) {
  event.notification.close()
  await clients.openWindow(`https://portal.valewisp.com/crm/client/${event.notification.data.client.id}`)
}, false)
