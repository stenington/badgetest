#!/usr/bin/env node

var assert = require('assert');

const PORT = process.env['PORT'] || 3000;
const COOKIE_SECRET = process.env['COOKIE_SECRET'] || null;
const DEBUG = ('DEBUG' in process.env);

assert.ok(COOKIE_SECRET, 'COOKIE_SECRET env var should be defined.');

var app = require('../').app.build({
  cookieSecret: COOKIE_SECRET,
  debug: DEBUG
});
var server = app;
server.listen(PORT, function(){
  console.log("Listening on port " + PORT + ".");
});