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
  Protocol: require('./Base'),

  /**
  * @returns {DelimiterProtocol}
  */
  DelimiterProtocol: require('./common/DelimiterProtocol'),

  /**
   * @returns {NullProtocol}
   */
  NullProtocol: require('./common/NullProtocol'),

  /**
   * @returns {ChunkProtocol}
   */
  ChunkProtocol: require('./common/ChunkProtocol'),
};
