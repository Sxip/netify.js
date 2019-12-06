module.exports = {
  /**
   * @returns {NetifyServer}
   */
  NetifyServer: require('./NetifyServer'),

  /**
   * @returns {NetifyClient}
   */
  NetifyClient: require('./NetifyClient'),

  /**
   * @returns {Protocol}
   */
  Protocol: require('./network/protocol/Base'),

  /**
  * @returns {DelimiterProtocol}
  */
  DelimiterProtocol: require('./network/protocol/common/DelimiterProtocol'),

  /**
   * @returns {NullProtocol}
   */
  NullProtocol: require('./network/protocol/common/NullProtocol'),

  /**
   * @returns {ChunkProtocol}
   */
  ChunkProtocol: require('./network/protocol/common/ChunkProtocol'),
};
