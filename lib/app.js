"use strict";

var zlib = require("zlib");

var cors = require("cors"),
    express = require("express");

var SyslogFilter = require("./syslog-filter");

module.exports = function(source) {
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

    var src = source;

    if (req.params.ps) {
      // process name was provided
      src = source.pipe(new SyslogFilter(req.params.ps));
    }

    if (acceptEncoding.indexOf("gzip") >= 0) {
      res.header("Content-Encoding", "gzip");
      return source.pipe(zlib.createGzip(options)).pipe(res);
    }

    if (acceptEncoding.indexOf("deflate") >= 0) {
      res.header("Content-Encoding", "deflate");
      return source.pipe(zlib.createDeflate(options)).pipe(res);
    }

    return source.pipe(res);
  });

  return app;
};
