"use strict";

var stream = require("stream"),
    zlib = require("zlib");

var cors = require("cors"),
    express = require("express");

var SyslogFilter = require("./syslog-filter");

module.exports = function(nexus) {
  var app = express();

  app.disable('x-powered-by');

  app.use(cors());

  app.get("/:ps(\\w*)?", function(req, res, next) {
    res.header("Content-Type", "text/plain");

    // compression
    var acceptEncoding = req.headers["accept-encoding"] || "",
        options = {
          flush: zlib.Z_PARTIAL_FLUSH
        };

    var sink = new stream.PassThrough();

    if (req.params.ps) {
      // process name was provided
      sink = sink.pipe(new SyslogFilter(req.params.ps));
    }

    var response;

    if (acceptEncoding.indexOf("gzip") >= 0) {
      res.header("Content-Encoding", "gzip");
      sink = sink.pipe(zlib.createGzip(options));
    } else if (acceptEncoding.indexOf("deflate") >= 0) {
      res.header("Content-Encoding", "deflate");
      sink = sink.pipe(zlib.createDeflate(options));
    }

    // don't reassign to sink--we need the stream that's actually plugged into
    // nexus
    nexus.pipe(sink).pipe(res);

    req.on("close", function() {
      nexus.unpipe(sink);
    });
  });

  return app;
};
