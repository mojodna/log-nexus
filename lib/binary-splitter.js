"use strict";

var stream = require("stream"),
    util = require("util");

var buffertools = require("buffertools");

// TODO write this up as "binary-safe stream chunking"
// TODO write up Chunker
var BinarySplitter = function(delimiter) {
  stream.Transform.call(this);

  this.delimiter = delimiter || "\n";

  var pending = new Buffer(0);

  this._transform = function(chunk, encoding, callback) {
    var buffer = Buffer.concat([pending, chunk]),
        offset = 0;

    while (offset < buffer.length) {
      var idx = buffertools.indexOf(buffer, this.delimiter, offset);

      if (idx < 0) {
        break;
      }

      this.push(buffer.slice(offset, idx + 1));
      offset = idx + 1;
    }

    pending = buffer.slice(offset);

    return setImmediate(callback);
  };

  this._flush = function(callback) {
    if (pending.length > 0) {
      this.push(pending);
    }

    return setImmediate(callback);
  };
};

util.inherits(BinarySplitter, stream.Transform);

module.exports = BinarySplitter;
