UPTO

- I just: did the FE of client outage page, and have populated the page with data down until the copyable message.
- next: complete the page functionality (data and behaviour), update notication to link back to the outage mgmt app.  make `/outages` list
- next: create prototype for using SNMP or pings inside network to test for outage.  SNMP walk to get network topology?  monitor uptime?  how would I tie this to users using UNMS or Sonar?

V1

8. ✅ Handle company name notifications (like Dean Irvine)
8. have some copy-pastable text
  - link from notification to page with message and client name and outage time.
  - one link to open client in UNMS, another link to copy message to clipboard
  - click to copy and open valewisp facebook group page.
  - 13:43: We're aware of an issue causing intermittent connectivity. We're currently en route to restore this as quickly as possible.
8. Mock up pages 
    - want to have a summary showing daily/weekly/monthly uptime across all clients.
    - want to show outage history per client.
7. Workflow.
8. message clients
    - message history

Feature ideas

- "message now" or "wait"

Tech ideas:

- use this lib to make a stream from fetch?  https://www.twilio.com/blog/using-rxjs-observables-with-javascript-async-and-await
- https://linux.die.net/man/1/snmpwalk
- next JS, NX, Material design

Hamish notes:

- microtik and juniper for routers
- ubiquiti customer presimses equipment (CPE).  "The CPE" is the dish on the outiside of the customers house
- mimosa
- cambium

What can I do next?

- Better outage detection.  Hamish won't message people unless he knows a tower is down.  Build concept of equipment outage.  Not tied to UNMS any more :D  Hard, interesting problem.
- SMS Messaging - medium, but premature.  He won't send bulk messages and is not sure about spending money just yet.
- Copy paste message - easy, low impact.  No API stuff.
- Dashboards showing outages - medium, sort of dull problem.  Client table.  Use client stream to read clients.  Update every 5 minutes.  Would need to do this anyway with outage detection.