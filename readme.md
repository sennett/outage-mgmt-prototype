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
6. don't renotify on service restart
7. pretty page
    - only write service worker when permissions granted (otherwise we are subscribing before asking for )     https://stackoverflow.com/questions/36126541/domexception-registration-failed-permission-denied I had this issue with Chrome after switching from http to https for local dev - needed a new permission for notifications.  I also discovered that you can't ask for notification permission in the service worker itself - you must ask for permission outside of the service worker.

V1

7. Isolate clients that had an outage and have returned to normal
7. Workflow
8. message clients

Feature ideas

- "message now" or "wait"

UPTO

- I just: ensured that auth was working
- next: make u and p configurable.

Hamish notes:

- microtik and juniper for routers
- ubiquiti customer presimses equipment (CPE).  "The CPE" is the dish on the outiside of the customers house
- mimosa
- cambium
