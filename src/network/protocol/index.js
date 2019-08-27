module.exports = {
  /**
   * @returns {DelimiterProtocol}
   */
  Delimiter: require('./common/DelimiterProtocol'),

  /**
   * @returns {NullProtocol}
   */
  Null: require('./common/NullProtocol'),

  /**
   * @returns {ChunkProtocol}
   */
  Chunk: require('./common/ChunkProtocol'),

  /**
   * @returns {Protocol}
   */
  Base: require('./Protocol'),
};
