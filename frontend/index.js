/* global _, atob, fetch */

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
  const response = await fetch('/create-subscription', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription),
    credentials: 'same-origin'
  })
  return response
}

const featureCheck = () => {
  const missingFeatures = []
  if (!('serviceWorker' in navigator)) {
    missingFeatures.push('Service Worker')
  }
  if (!('PushManager' in window)) {
    missingFeatures.push('Push API')
  }

  const warningElement = document.getElementById('error-target')
  const controlsElement = document.getElementById('controls')

  if (missingFeatures.length) {
    const template = _.template(document.getElementById('missing-features-message').innerHTML)
    const output = template({ reasons: missingFeatures.join(', ') })
    warningElement.innerHTML = output
  } else {
    warningElement.classList.add('hidden')
    controlsElement.classList.remove('hidden')
  }

  return missingFeatures.length === 0
}

const installNotifications = async () => {
  await window.Notification.requestPermission()
  const swRegistration = await navigator.serviceWorker.register('service-worker.js')
  const existingSubscription = await swRegistration.pushManager.getSubscription()
  if (!existingSubscription) {
    const options = {
      applicationServerKey: urlB64ToUint8Array('BFt6VLXnTbwuzw8tjIYUCoZ-bQ-B0WRvBQ5LB8RheyuXMn7tyTYXLAMhTqRGuE2UjJqeh1YCOHQzWYOl704qKpc'),
      userVisibleOnly: true
    }
    const subscription = await swRegistration.pushManager.subscribe(options)
    await saveSubscription(subscription)
  }
  updateUI()
}

const updateUI = () => {
  if (window.Notification.permission === 'granted') {
    document.getElementById('controls').classList.add('hidden')
    document.getElementById('all-installed').classList.remove('hidden')
  }
}

const main = async () => {
  const browserSupported = featureCheck()

  if (browserSupported) {
    updateUI()
  }
}

main()
