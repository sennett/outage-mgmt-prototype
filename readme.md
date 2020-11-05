UPTO

- I just: handle business-style notifications.
- next: create prototype for using SNMP or pings inside network to test for outage.  SNMP walk to get network topology?  monitor uptime?  how would I tie this to users using UNMS or Sonar?

V1

8. Handle company name notifications (like Dean Irvine)
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
- make the pinging stream time configurable
- https://linux.die.net/man/1/snmpwalk

Hamish notes:

- microtik and juniper for routers
- ubiquiti customer presimses equipment (CPE).  "The CPE" is the dish on the outiside of the customers house
- mimosa
- cambium
