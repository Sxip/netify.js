module.exports = {
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
