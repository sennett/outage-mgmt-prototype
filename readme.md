V0

1. ✅ Tests
2. ✅ .env and git
3. Isolate clients with an outage - X-times in Y seconds
     - ensure that we don't re-isolate once flagged - DB
6. heroku deploy
5. Whatsapp outage notifs. to Hamish

V1

7. Isolate clients that had an outage and have returned to normal
7. Workflow
8. message clients

Feature ideas

- "message now" or "wait"

UPTO

- I just: implemented isolating clients with outage after 30 seconds (including tests)
- next step: do not output twice once flagged as having an outage
- use a redis to store this in memory stuff.  rename client-with-outage to continuous client with outage.  have another stream that consumes this and looks at redis, only outputting when not found in redis.

Hamish notes:

- microtik and juniper for routers
- ubiquiti customer presimses equipment (CPE).  "The CPE" is the dish on the outiside of the customers house
- mimosa
- cambium