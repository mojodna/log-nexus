"use strict";

var stream = require("stream"),
    util = require("util");

// TODO write this up as "how to merge readable streams"
var InfinitePassThrough = function() {
  stream.Transform.call(this);

  this._transform = function(chunk, encoding, callback) {
    // only pass data on if something's listening and we're flowing
    if (this._readableState.pipesCount > 0 &&
        this._readableState.buffer.length === 0) {
      this.push(chunk);
    }

    return callback();
  };

  setInterval(function() {
    console.log("%d clients.", this._readableState.pipesCount);
  }.bind(this), 5000).unref();

  // overwrite Transform's end() function with a mangled version that doesn't
  // actually end.
  this.end = function(chunk, encoding, cb) {
    if (typeof chunk === 'function') {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === 'function') {
      cb = encoding;
      encoding = null;
    }

    cb = cb || function() {};

    if (typeof chunk !== 'undefined' && chunk !== null) {
      this.write(chunk, encoding);
    }

    return cb();
  };
};

util.inherits(InfinitePassThrough, stream.Transform);

module.exports = InfinitePassThrough;
