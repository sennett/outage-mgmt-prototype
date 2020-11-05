UPTO

- I just: made the client stream return the retrieval time from when we hit the API
- next: make the outage service pass client retrival times into the repository
- next: save message that caused outage + revival
- next: create prototype for using SNMP or pings inside network to test for outage.  SNMP walk to get network topology?  monitor uptime?  how would I tie this to users using UNMS or Sonar?

V1

1. ✅ Fix bug with chrome system notification
    - only make new subscription if we don't have one already.  `self.registration.pushManager.getSubscription().then(console.log)`
    - either return promises or use event.waitUntil in each lifecycle hook
    - now we have an issue where we have activated service worker, then disable notifications, then reanable.  we loose the push manager subscription.  check this code here https://github.com/GoogleChromeLabs/web-push-codelab/tree/master/completed/08-push-subscription-change  https://developers.google.com/web/fundamentals/codelabs/push-notifications  
7. Store all the outage data.
9. resolved client notification (update to say resolved)
8. Handle company name notifications (like Dean Irvine)
8. Mock up pages 
    - want to have a way of showing daily/weekly/monthly uptime across all clients.
    - want to show outage history per client.
7. Workflow.
8. message clients
    - message history

V0

1. ✅ Tests
2. ✅ .env and git
3. ✅ Isolate clients with an outage - X-times in Y seconds
4. ✅ ensure that we don't re-isolate once flagged - DB
6. error handling (logging)
    - ✅ warns when can't access external API
    - ✅ warns when external API does not return something the correct shape
6. heroku deploy
    - ✅ machine
    - ✅ make messaging service log info
    - ✅ expose web server for keepalive
    - 🚫 CI 
    - ✅ logging - log out num of calls every 10 mins, rather than every second
5. Outage notifs.
    - ✅ Service worker.
    - ✅ Browser notification. 
    - ✅ Websocket/push API. 
    - ✅ message contents.
    - ✅ Basic auth.
6. ✅ don't renotify on service restart
7. ✅ pretty page
    - only write service worker when permissions granted (otherwise we are subscribing before asking for )     https://stackoverflow.com/questions/36126541/domexception-registration-failed-permission-denied I had this issue with Chrome after switching from http to https for local dev - needed a new permission for notifications.  I also discovered that you can't ask for notification permission in the service worker itself - you must ask for permission outside of the service worker.
8. ✅ deploy

Feature ideas

- "message now" or "wait"

Tech ideas:

- use this lib to make a stream from fetch?  https://www.twilio.com/blog/using-rxjs-observables-with-javascript-async-and-await
- make the pinging stream time configurable

Hamish notes:

- microtik and juniper for routers
- ubiquiti customer presimses equipment (CPE).  "The CPE" is the dish on the outiside of the customers house
- mimosa
- cambium
