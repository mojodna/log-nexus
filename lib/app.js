"use strict";

var zlib = require("zlib");

var cors = require("cors"),
    express = require("express");

module.exports = function(source) {
  var app = express();

  app.disable('x-powered-by');

  app.use(cors());

  app.get("/", function(req, res, next) {
    // TODO what happens when passthrough's buffer fills up?
    res.header("Content-Type", "text/plain");

    // compression
    var acceptEncoding = req.headers["accept-encoding"] || "",
        options = {
          flush: zlib.Z_PARTIAL_FLUSH
        };

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
