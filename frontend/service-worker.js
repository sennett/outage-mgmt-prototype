/* globals self, atob, fetch, clients */

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
  const SERVER_URL = 'http://localhost:3000/create-subscription'
  const response = await fetch(SERVER_URL, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
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
    const response = await saveSubscription(subscription)
    console.log(response)
  } catch (err) {
    console.log('Error', err)
  }
})

const showNotification = async (client) => {
  await self.registration.showNotification(`Outage for ${client.firstName}`, {
    body: 'Click to open UNMS and see what\'s up.',
    data: { client }
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
