# BadgeTest

Read the [How To](https://github.com/stenington/badgetest/wiki/How-To) for basic usage instructions.

## Frontend

Badgetest is an unimaginatively named utility for issuing some number
of badges to some email address on a Backpack server.

Detailed usage instructions are available on the wiki [How To][] page.

[How To]: https://github.com/stenington/badgetest/wiki/How-To

### Unique Naming

Badge names are made unique by appending the string `timestamp-n` where 

  * the timestamp is in millis, and will be the same for all badges issued in one group
  * and *n* is the badge's number in the group. 

### Unique Images

Unique badge images can be generated using [vanillicons][]. Check the *generate images*
checkbox and each assertion will use the vanillicon for its badge name as the badge 
graphic.

[vanillicons]: http://vanillicon.com

### Email

You can use an actual Persona account connected to your real email, **or** you 
can use [mockmyid.com](https://github.com/callahad/mockmyid)! It's super-convenient
for creating different test backpacks.

## Backend

The backend provides two endpoints:

  * `/raw.json` provides a default assertion with unhashed email address
  * `/hashed.json` provides a default assertion with hashed email address

Both endpoints can take two query parameters to modify the default values:

  * `?email=<email>` will override the recipient
  * `?override=<json>` will recursively merge the specified json with the defaults, 
    allowing you to override any field you want

Badgetest uses these endpoints to avoid having to actually store assertions. The
data is instead either the defaults or gets encoded in the assertion url itself
(and then baked into a badge or sent to the Issuer API). 
