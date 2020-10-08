V0

1. ✅ Tests
2. ✅ .env and git
3. ✅ Isolate clients with an outage - X-times in Y seconds
4. ✅ ensure that we don't re-isolate once flagged - DB
6. heroku deploy
5. Whatsapp outage notifs. to Hamish

V1

7. Isolate clients that had an outage and have returned to normal
7. Workflow
8. message clients

Feature ideas

- "message now" or "wait"

UPTO

- I just: implemented a stream that ouputs only once when a client has an outage.
- next step: fold this into continuous client with outage  - probably don't need stream across two separate files.
- make the app start, and make e2e tests actually run the app against a known data set with mock services.
- maybe make a little server where we can turn clients on and off and watch them trigger.
- then point 6 above

Hamish notes:

- microtik and juniper for routers
- ubiquiti customer presimses equipment (CPE).  "The CPE" is the dish on the outiside of the customers house
- mimosa
- cambium