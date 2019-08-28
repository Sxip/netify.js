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
   * @returns {any}
   */
  Protocol: require('./network/protocol'),
};
