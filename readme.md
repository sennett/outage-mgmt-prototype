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
    - Basic auth.
6. don't renotify on service restart

V1

7. Isolate clients that had an outage and have returned to normal
7. Workflow
8. message clients

Feature ideas

- "message now" or "wait"

UPTO

- I just:got the notification displaying properly
- next: test with local endpoint (configurable detection time).  tidy up these files and move them around.  look into service worker releases - how do I update?
- then: save subscription.  postgres local and prod.  knex.  migrations.

Hamish notes:

- microtik and juniper for routers
- ubiquiti customer presimses equipment (CPE).  "The CPE" is the dish on the outiside of the customers house
- mimosa
- cambium
