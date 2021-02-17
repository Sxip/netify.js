declare module 'netify.js' {

  import { EventEmitter } from 'events';
  import { Socket, TcpSocketConnectOpts } from 'net';

  export interface NetifyServerOptions {
    host?: string;
    port: number;
  }

  export interface NetifyClientOptions {
    host: string;
    port: number;
  }

  export interface ProtocolOptions {
    readBuffer?: number;
    writeBuffer?: number;
  }

  export class NetifyServer<T extends Protocol> extends EventEmitter {
    public constructor(options: NetifyServerOptions);

    public connections: Set<ServerSocket<T>>;

    public useProtocol<T>(handler: new (...args: any[]) => T, options?: Object): this;
    public broadcast(message: string | Buffer): Promise<number[]>
    public closeConnections(): Promise<any[]>;
    public close(): Promise<void>;
    public serve(): Promise<void>;

    public on(event: 'connection', listener: (connection: NetifySocket<T>) => any): this;
    public on(event: 'error', listener: (error: Error) => any): this;
    public on(event: 'close', listener: () => any): this;
  }

  export class ServerSocket<T extends Protocol> extends NetifySocket<T> { }

  export class NetifySocket<T extends Protocol> extends EventEmitter {
    public constructor(socket: Socket);

    public protocol: T;

    public write(message: string | Buffer): void;
    public flush(): Promise<number>;
    public connect(options: TcpSocketConnectOpts): Promise<void>;
    public dispose(): void;
    public close(): void;

    public on(event: 'received', listener: (message: any) => any): this;
    public on(event: 'error', listener: (error: Error) => any): this;
    public on(event: 'close', listener: () => any): this;
  }

  export class NetifyClient<T extends Protocol> extends NetifySocket<T> {
    public constructor(options: NetifyClientOptions);

    public connect(): Promise<void>;
    public useProtocol<T>(handler: new (...args: any[]) => T, options?: Object): this;
  }

  export class ByteBuffer {
    public constructor(size?: number);

    public offset(): number;
    public offset(value: number): number;

    public end(): number;
    public end(value: number): number;

    public length(): number;
    public length(value: number): number;

    public capacity(): number;
    public buffer(): Buffer;
    public fullBuffer(): Buffer;

    public indexOf(value: any): number;
    public contains(value: any): number;
    public reset(): void;
    public skip(length: number): void;
    public drain(length: number): void;
    public slice(offset: number, end: number): Buffer;
    public sliceNoCheck(offset: number, end: number): Buffer;

    public ensureRead(length: number): void;
    public read(length: number): Buffer;
    public readUntil(value: any): Buffer;
    public readUntilByte(value: number): Buffer;
    public readCString(): Buffer;
    public readBigInt64BE(): BigInt;
    public readBigInt64LE(): BigInt;
    public readBigUInt64BE(): BigInt;
    public readBigUInt64LE(): BigInt;
    public readDoubleBE(): number;
    public readDoubleLE(): number;
    public readFloatBE(): number;
    public readFloatLE(): number;
    public readInt8(): number;
    public readUInt8(): number;
    public readInt16BE(): number;
    public readInt16LE(): number;
    public readUInt16BE(): number;
    public readUInt16LE(): number;
    public readInt32BE(): number;
    public readInt32LE(): number;
    public readUInt32BE(): number;
    public readUInt32LE(): number;
    public readIntBE(): number;
    public readIntLE(): number;
    public readUIntBE(): number;
    public readUIntLE(): number;

    public ensureSize(addition: number): void;
    public write(buffer: Buffer): void;
    public writeString(text: string, encoding: BufferEncoding): void;
    public writeCString(text: string, encoding: BufferEncoding): void;
    public writeBigInt64BE(value: bigint): void;
    public writeBigInt64LE(value: bigint): void;
    public writeBigUInt64BE(value: bigint): void;
    public writeDoubleBE(value: number): void;
    public writeDoubleLE(value: number): void;
    public writeFloatBE(value: number): void;
    public writeFloatLE(value: number): void;
    public writeInt8(value: number): void;
    public writeUInt8(value: number): void;
    public writeByte(value: number): void;
    public writeInt16BE(value: number): void;
    public writeInt16LE(value: number): void;
    public writeUInt16BE(value: number): void;
    public writeUInt16LE(value: number): void;
    public writeInt32BE(value: number): void;
    public writeInt32LE(value: number): void;
    public writeUInt32BE(value: number): void;
    public writeUInt32LE(value: number): void;
    public writeUIntBE(value: number): void;
    public writeUIntLE(value: number): void;
  }

  export abstract class Protocol {
    public constructor(options?: ProtocolOptions);

    public reader: ByteBuffer;
    public writer: ByteBuffer;

    public write(message: string | Buffer): void;
    public flush(): Promise<number>;

    protected push(message: any): void;
    protected abstract chunk(bytes: number): void;
  }

  export class ChunkProtocol extends Protocol {
    protected chunk(bytes: number): void;
  }

  export class DelimiterProtocol extends Protocol {
    protected chunk(bytes: number): void;
  }

  export class NullProtocol extends Protocol {
    protected chunk(bytes: number): void;
  }
}