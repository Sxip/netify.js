import { Transform } from 'stream';

export class NetifyDelimiterPipe extends Transform {
  /**
   * Buffer offset
   */
  private offset: number = 0;

  /**
   * Allocates a new buffer of the given size
   */
  private buffer: Buffer;

  /**
   * Initializes the packet stream
   * @param delimiter Packet delimiter
   * @param bufferSize Packet buffer size
   */
  public constructor(
    private readonly delimiter: string | number,
    bufferSize: number,
    private readonly bufferResize: boolean,
  ) {
    super();

    this.buffer = Buffer.alloc(bufferSize);
  }

  /**
   * Gets the size of the buffer
   */
  public get size(): number {
    return this.buffer.length;
  }

  /**
   * Handles buffer transform
   * @param chunk Chuck of the packet
   * @param encoding Chuck encoding
   * @param next Callback function
   */

  // tslint:disable-next-line: function-name
  public _transform(chunk: Buffer, encoding: BufferEncoding, next: () => void): void {
    const available = this.size - this.offset;

    if (this.bufferResize && available < chunk.length) {
      const buffer = Buffer.alloc(this.size * 2 + chunk.length);
      this.buffer.copy(buffer);
      this.buffer = buffer;
    }

    chunk.copy(this.buffer, this.offset, 0, chunk.length);
    this.offset += chunk.length;

    do {
      const position = this.checkForDelimiter(this.delimiter);
      if (position === -1) break;

      const fullPacket = this.getFullPacket(position);
      this.push(fullPacket);

      this.buffer.copy(this.buffer, 0, position + 1);
      this.offset -= position + 1;
    } while (this.offset > 0);

    next();
  }

  /**
   * Gets the full packet from the buffer
   * @param position Position of packet
   */
  private getFullPacket(position: number): Buffer {
    return this.buffer.slice(0, position);
  }

  /**
   * Checks the buffer index
   * @param delimiter Delimiter to check
   */
  private checkForDelimiter(delimiter: string | number): number {
    return this.buffer.slice(0, this.offset)
      .indexOf(delimiter);
  }
}
