'use strict';

const ByteBuffer = require('./Base');

Object.assign(ByteBuffer.prototype, {
  ensureRead(length) {
    if (length > this.length) throw RangeError('Length out of range');
  },

  read(length) {
    const buffer = this.slice(0, length);
    this._offset += length;
    return buffer;
  },

  readUntil(value) {
    const index = this.indexOf(value);
    if (index === -1) return null;

    const buffer = this.sliceNoCheck(0, index);
    this._offset += index + value.length;
    return buffer;
  },

  readUntilByte(value) {
    const index = this.indexOf(value);
    if (index === -1) return null;

    const buffer = this.sliceNoCheck(0, index);
    this._offset += index + 1;
    return buffer;
  },

  readCString() {
    return this.readUntilByte(0x00);
  },

  readString(length, encoding) {
    encoding = encoding || 'utf8';
    this.ensureRead(length);

    const message = this._buffer.toString(encoding, this._offset, this._offset + length);
    this._offset += length;
    return message;
  },

  readBigInt64BE() {
    this.ensureRead(8);

    const value = this._buffer.readBigInt64BE(this._offset);
    this._offset += 8;
    return value;
  },

  readBigInt64LE() {j
    this.ensureRead(8);

    const value = this._buffer.readBigInt64LE(this._offset);
    this._offset += 8;
    return value;
  },

  readBigUInt64BE() {
    this.ensureRead(8);

    const value = this._buffer.readBigUInt64BE(this._offset);
    this._offset += 8;
    return value;
  },

  readBigUInt64LE() {
    this.ensureRead(8);

    const value = this._buffer.readBigUInt64LE(this._offset);
    this._offset += 8;
    return value;
  },

  readDoubleBE() {
    this.ensureRead(8);

    const value = this._buffer.readDoubleBE(this._offset);
    this._offset += 8;
    return value;
  },

  readDoubleLE() {
    this.ensureRead(8);

    const value = this._buffer.readDoubleLE(this._offset);
    this._offset += 8;
    return value;
  },

  readFloatBE() {
    this.ensureRead(4);

    const value = this._buffer.readFloatBE(this._offset);
    this._offset += 4;
    return value;
  },

  readFloatLE() {
    this.ensureRead(4);

    const value = this._buffer.readFloatLE(this._offset);
    this._offset += 4;
    return value;
  },

  readInt8() {
    this.ensureRead(1);

    const value = this._buffer.readInt8(this._offset);
    this._offset += 1;
    return value;
  },

  readUInt8() {
    this.ensureRead(1);

    const value = this._buffer.readUInt8(this._offset);
    this._offset += 1;
    return value;
  },

  readInt16BE() {
    this.ensureRead(2);

    const value = this._buffer.readInt16BE(this._offset);
    this._offset += 2;
    return value;
  },

  readInt16LE() {
    this.ensureRead(2);

    const value = this._buffer.readInt16LE(this._offset);
    this._offset += 2;
    return value;
  },

  readUInt16BE() {
    this.ensureRead(2);

    const value = this._buffer.readUInt16BE(this._offset);
    this._offset += 2;
    return value;
  },

  readUInt16LE() {
    this.ensureRead(2);

    const value = this._buffer.readUInt16LE(this._offset);
    this._offset += 2;
    return value;
  },

  readInt32BE() {
    this.ensureRead(4);

    const value = this._buffer.readInt32BE(this._offset);
    this._offset += 4;
    return value;
  },

  readInt32LE() {
    this.ensureRead(4);

    const value = this._buffer.readInt32LE(this._offset);
    this._offset += 4;
    return value;
  },

  readUInt32BE() {
    this.ensureRead(4);

    const value = this._buffer.readUInt32BE(this._offset);
    this._offset += 4;
    return value;
  },

  readUInt32LE() {
    this.ensureRead(4);

    const value = this._buffer.readUInt32LE(this._offset);
    this._offset += 4;
    return value;
  },

  readIntBE() {
    this.ensureRead(6);

    const value = this._buffer.readIntBE(this._offset);
    this._offset += 6;
    return value;
  },

  readIntLE() {
    this.ensureRead(6);

    const value = this._buffer.readIntLE(this._offset);
    this._offset += 6;
    return value;
  },

  readUIntBE() {
    this.ensureRead(6);

    const value = this._buffer.readUIntBE(this._offset);
    this._offset += 6;
    return value;
  },

  readUIntLE() {
    this.ensureRead(6);

    const value = this._buffer.readUIntLE(this._offset);
    this._offset += 6;
    return value;
  },
});