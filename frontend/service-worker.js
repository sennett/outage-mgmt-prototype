/* globals self, atob, fetch, clients */

const BASE_URL = self.registration.scope // includes trailing /

const urlB64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const saveSubscription = async (subscription) => {
  const response = await fetch(`${BASE_URL}create-subscription`, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription),
    credentials: 'same-origin'
  })
  return response
}

self.addEventListener('activate', async () => {
  try {
    const options = {
      applicationServerKey: urlB64ToUint8Array('BFt6VLXnTbwuzw8tjIYUCoZ-bQ-B0WRvBQ5LB8RheyuXMn7tyTYXLAMhTqRGuE2UjJqeh1YCOHQzWYOl704qKpc'),
      userVisibleOnly: true
    }
    const subscription = await self.registration.pushManager.subscribe(options)
    await saveSubscription(subscription)
  } catch (err) {
    console.log('Error', err)
  }
})

const showNotification = async (client) => {
  await self.registration.showNotification(`Outage for ${client.firstName} ${client.lastName}`, {
    body: 'Click to open UNMS and see what\'s up.',
    data: { client },
    tag: client.id,
    requireInteraction: true,
    image: `${BASE_URL}internet-down.png`,
    icon: `${BASE_URL}internet-down.png`,
    badge: `${BASE_URL}internet-down.png`
  })
}

self.addEventListener('push', async function (event) {
  if (event.data) {
    await showNotification(event.data.json())
  } else {
    console.log('Push event but no data')
  }
})

self.addEventListener('notificationclick', async function (event) {
  event.notification.close()
  await clients.openWindow(`https://portal.valewisp.com/crm/client/${event.notification.data.client.id}`)
}, false)
