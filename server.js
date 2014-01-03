#!/usr/bin/env node
"use strict";

var http = require("http");

var InfinitePassThrough = require("./lib/infinite-passthrough"),
    makeApp = require("./lib/app"),
    makeSyslog = require("./lib/syslog"),
    makeWS = require("./lib/websocket");

var opts = require("commander")
  .version(require("./package.json").version)
  .usage("[options]")
  // .option("-r, --remote <url>", "Remote source")
  .option("-s, --syslog <port>", "Syslog port (defaults to 8514)", parseInt, 8514)
  // .option("-S, --no-syslog", "Don't start syslog server") // only makes
  // sense with remote sources
  .option("-p, --port <port>", "HTTP/WS port (defaults to 8080)", parseInt, 8080)
  .parse(process.argv);

var nexus = new InfinitePassThrough(),
    app = makeApp(nexus),
    server = http.createServer(app);

// prime the nexus
nexus.write("\n");

makeWS(server, nexus);

server.listen(opts.port, function() {
  console.log("Listening at {http,ws}://%s:%d", this.address().address, this.address().port);
});

makeSyslog(nexus).listen(opts.syslog, function() {
  console.log("Listening at tcp://%s:%d", this.address().address, this.address().port);
});

