const ByteBuffer = require('./Base');

Object.assign(ByteBuffer.prototype, {
  indexOf(value, offset) {
    offset = offset || 0;
    offset = this._offset + offset;

    let index = this._buffer.indexOf(value, offset);
    index = index < this._end ? index - offset : -1;

    return index;
  },

  contains(value) {
    return this.indexOf(value) !== -1;
  },
});
