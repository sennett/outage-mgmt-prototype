const featureCheck = () => {
  const missingFeatures = []
  if (!('serviceWorker' in navigator)) {
    missingFeatures.push('Service Worker')
  }
  if (!('PushManager' in window)) {
    missingFeatures.push('Push API')
  }
  missingFeatures.push('Service Worker')
  if (missingFeatures.length) {
    const template = _.template(document.getElementById('missing-features-message').innerHTML)
    const output = template({ reasons: missingFeatures.join(', ') })
    document.getElementById('error-target').innerHTML = output
  }
}

featureCheck()
