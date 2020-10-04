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

- I just: worked out how to emit events that only emit X number within Y mins (see rxjs-spikes).
- next step: use this to isolate clients with outage in step three above.
- start with the tests.  get first passing then flesh out the rest and get them passing.
