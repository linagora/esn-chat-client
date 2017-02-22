'use strict';

const CONSTANTS = require('./constants');
const request = require('request-promise-native');
const WebsocketClient = require('./websocket');

module.exports = {
  get
};

function get(options) {
  const url = options.url || CONSTANTS.DEFAULT_URL;

  return getUserId()
    .then(getAuthToken)
    .then(({token, userId}) => new WebsocketClient({token, url, userId}));

  function getAuthToken(userId) {
    return request.get(`${url}/api/authenticationtoken`, {
      jar: true,
      json: true
    }).then(body => {
      const token = body.token;

      if (!token) {
        throw new Error('Token not found');
      }

      return {token, userId};
    });
  }

  function getUserId() {
    return request.post(`${url}/api/login`, {
      form: {username: options.username, password: options.password},
      jar: true,
      json: true
    }).then(body => body._id);
  }
}
