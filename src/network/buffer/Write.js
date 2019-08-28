const ByteBuffer = require('./Base');

Object.assign(ByteBuffer.prototype, {
  ensureSize(addition) {
    if (this.capacity - this.end < addition) {
      const oldBuffer = this._buffer;

      // eslint-disable-next-line no-mixed-operators
      this._buffer = Buffer.allocUnsafe(this.capacity * 2 + addition);
      oldBuffer.copy(this._buffer, this._offset, this._offset, this._end);
    }
  },

  write(buffer) {
    this.ensureSize(buffer.length);

    buffer.copy(this._buffer, this._offset);
    this._end += buffer.length;
  },

  writeString(str, encoding) {
    encoding = encoding || ByteBuffer.DefaultEncoding;
    const bytesLen = Buffer.byteLength(str, encoding);

    this.ensureSize(bytesLen);
    this._buffer.write(str, this._end, encoding);
    this._end += bytesLen;
  },

  writeCString(str, encoding) {
    this.writeString(str, encoding);
    this.writeByte(0x00);
  },

  writeBigInt64BE(value) {
    this.ensureSize(8);

    this._buffer.writeBigInt64BE(value, this._end);
    this._end += 8;
  },

  writeBigInt64LE(value) {
    this.ensureSize(8);

    this._buffer.writeBigInt64LE(value, this._end);
    this._end += 8;
  },

  writeBigUInt64BE(value) {
    this.ensureSize(8);

    this._buffer.writeBigUInt64BE(value, this._end);
    this._end += 8;
  },

  writeBigUInt64LE(value) {
    this.ensureSize(8);

    this._buffer.writeBigUInt64LE(value, this._end);
    this._end += 8;
  },

  writeDoubleBE(value) {
    this.ensureSize(8);

    this._buffer.writeDoubleBE(value, this._end);
    this._end += 8;
  },

  writeDoubleLE(value) {
    this.ensureSize(8);

    this._buffer.writeDoubleLE(value, this._end);
    this._end += 8;
  },

  writeFloatBE(value) {
    this.ensureSize(4);

    this._buffer.writeFloatBE(value, this._end);
    this._end += 4;
  },

  writeFloatLE(value) {
    this.ensureSize(4);

    this._buffer.writeDoubleLE(value, this._end);
    this._end += 4;
  },

  writeInt8(value) {
    this.ensureSize(1);

    this._buffer.writeInt8(value, this._end);
    this._end += 1;
  },

  writeUInt8(value) {
    this.ensureSize(1);

    this._buffer.writeUInt8(value, this._end);
    this._end += 1;
  },

  writeByte(value) {
    this.writeUInt8(value);
  },

  writeInt16BE(value) {
    this.ensureSize(2);

    this._buffer.writeInt16BE(value, this._end);
    this._end += 2;
  },

  writeInt16LE(value) {
    this.ensureSize(2);

    this._buffer.writeInt16LE(value, this._end);
    this._end += 2;
  },

  writeUInt16BE(value) {
    this.ensureSize(2);

    this._buffer.writeUInt16BE(value, this._end);
    this._end += 2;
  },

  writeUInt16LE(value) {
    this.ensureSize(2);

    this._buffer.writeUInt16LE(value, this._end);
    this._end += 2;
  },

  writeInt32BE(value) {
    this.ensureSize(4);

    this._buffer.writeInt32BE(value, this._end);
    this._end += 4;
  },

  writeInt32LE(value) {
    this.ensureSize(4);

    this._buffer.writeInt32LE(value, this._end);
    this._end += 4;
  },

  writeUInt32BE(value) {
    this.ensureSize(4);

    this._buffer.writeUInt32BE(value, this._end);
    this._end += 4;
  },

  writeUInt32LE(value) {
    this.ensureSize(4);

    this._buffer.writeUInt32LE(value, this._end);
    this._end += 4;
  },

  writeUIntBE(value) {
    this.ensureSize(6);

    this._buffer.writeUIntBE(value, this._end);
    this._end += 6;
  },

  writeUIntLE(value) {
    this.ensureSize(6);

    this._buffer.writeUInt32LE(value, this._end);
    this._end += 6;
  },
});
