# badgetest

Badgetest is an unimaginatively named utility for issuing some number
of badges to some email address on the development, staging or production
server. 

You can choose to 

  * hash the email address, 
  * opt out of uniquifying the badge names (to test duplicate handling) 
  * and try out the modaless workflow, 

if you so choose.

## Unique Naming

Badge names are made unique by appending the string `timestamp-n` where 

  * the timestamp is in millis, and will be the same for all badges issued in one group
  * and *n* is the badge's number in the group. 
