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
   * @returns {object}
   */
  protocol: require('./network/protocol'),
};
