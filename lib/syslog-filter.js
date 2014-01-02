"use strict";

var stream = require("stream"),
    util = require("util");

var syslogRe = /^(<[0-9]+>)([0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z) ([^ ]+) ([^[]+)\[([^\]]+)\]: (.*)$/;

var SyslogFilter = function(ps) {
  stream.Transform.call(this);

  this._transform = function(chunk, encoding, callback) {
    var line = chunk.toString().trim(),
        parts = line.match(syslogRe);

    if (parts[4] === ps) {
      this.push(chunk);
    }

    return callback();
  };
};

util.inherits(SyslogFilter, stream.Transform);

module.exports = SyslogFilter;
