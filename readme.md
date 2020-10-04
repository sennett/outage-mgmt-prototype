V0

1. ✅ Tests
2. ✅ .env and git
3. Isolate clients with an outage - X-times in Y seconds
  - ensure that we don't re-notify once flagged - DB
4. Get phone number
5. Whatsapp API to Hamish
6. heroku deploy
7. Isolate clients that had an outage and have returned to normal
8. message clients

Feature ideas

- "message now" or "wait"

UPTO

- I just: worked out how to emit events that only emit X number within Y mins (see rxjs-spikes).
- next step: use this to isolate clients with outage in step three above.
- start with the tests.  get first passing then flesh out the rest and get them passing.