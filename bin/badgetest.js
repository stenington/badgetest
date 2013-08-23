#!/usr/bin/env node

const PORT = process.env['PORT'] || 3000;

var app = require('../').app.build();
var server = app;
server.listen(PORT, function(){
  console.log("Listening on port " + PORT + ".");
});