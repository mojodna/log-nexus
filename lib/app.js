"use strict";

var cors = require("cors"),
    express = require("express");

module.exports = function(source) {
  var app = express();

  app.disable('x-powered-by');

  app.use(cors());

  app.get("/", function(req, res, next) {
    // TODO what happens when passthrough's buffer fills up?
    res.header("Content-Type", "text/plain");

    return source.pipe(res);
  });

  return app;
};
