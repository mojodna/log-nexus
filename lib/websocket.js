"use strict";

var wsstream = require("websocket-stream"),
    ws = require("ws");

module.exports = function(server, source) {
  new ws.Server({
    server: server
  }).on("connection", function(ws) {
    return source
      .pipe(wsstream(ws))
      .on("error", function(err) {
        console.warn(err);
      });
  });
};
