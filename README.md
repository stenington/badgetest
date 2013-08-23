# Badgetest [![Build Status](https://secure.travis-ci.org/stenington/badgetest.png?branch=kaboom)](http://travis-ci.org/stenington/badgetest) 

Rebuild of Badgetest

## Quick Start

```
git clone -b kaboom git://github.com/stenington/badgetest.git badgetest
cd badgetest
npm install
npm test
DEBUG= COOKIE_SECRET=cookie node bin/badgetest.js
```

Then visit http://localhost:3000.

## Environment Variables

**Note:** When an environment variable is described as representing a
boolean value, if the variable exists with *any* value (even the empty
string), the boolean is true; otherwise, it's false.

* `COOKIE_SECRET` is the secret used to encrypt and sign cookies,
  to prevent tampering.

* `DEBUG` represents a boolean value. Setting this to true makes the server
  use unminified source code on the client-side, among other things.

* `PORT` is the port that the server binds to. Defaults to 3000.

## Tests

All tests can be run via `npm test`.

## Test Coverage

Build/install [jscoverage][], run `make test-cov`, then open
`coverage.html` in a browser.
 
Coverage should always be at 100%. Pull requests that break this will
be rejected.

[jscoverage]: https://github.com/visionmedia/node-jscoverage 