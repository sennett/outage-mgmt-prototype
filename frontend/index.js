/* global _ */

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

const installServiceWorker = async () => {
  await window.Notification.requestPermission()
  const swRegistration = await navigator.serviceWorker.register('service-worker.js')
  checkNotificationsPermission()
  return swRegistration
}

const checkNotificationsPermission = () => {
  if (window.Notification.permission === 'granted') {
    document.getElementById('controls').classList.add('hidden')
    document.getElementById('all-installed').classList.remove('hidden')
  }
}

const main = async () => {
  const browserSupported = featureCheck()

  if (browserSupported) {
    checkNotificationsPermission()
  }
}

main()
