"use strict";

var net = require("net");

var BinarySplitter = require("./binary-splitter");

module.exports = function(sink) {
  return net.createServer(function(stream) {
    // split by line and output to the sink
    stream.pipe(new BinarySplitter()).pipe(sink);
  });
};
