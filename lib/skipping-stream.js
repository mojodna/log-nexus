"use strict";
 
var stream = require("stream"),
    util = require("util");
 
var SkippingStream = function() {
  stream.PassThrough.call(this);
 
  var chunk;
 
  this._read = function(size) {
    if (chunk) {
      this.push(chunk);

      chunk = null;
    }
  };
 
  this._write = function(_chunk, encoding, callback) {
    chunk = _chunk;
 
    return callback();
  };
};
 
util.inherits(SkippingStream, stream.PassThrough);
 
module.exports = SkippingStream;
