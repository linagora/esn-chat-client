'use strict';

const CONSTANTS = require('./constants');
const EventEmitter = require('events').EventEmitter;
const socketIO = require('socket.io-client');

class WebsocketClient extends EventEmitter {
  constructor(options) {
    super();
    this.options = options;
  }

  connect() {
    this.io = socketIO(`${this.options.url}${CONSTANTS.NAMESPACE}`, {
      query: `token=${this.options.token}&user=${this.options.userId}`,
      forceNew: true
    });
    this.io.emit('subscribe', CONSTANTS.DEFAULT_ROOM);

    this.io.on('connect', () => {
      this.emit('connect');
    });

    this.io.on('disconnect', () => {
      this.emit('disconnect');
    });

    this.io.on('message', data => {
      this.emit('message', data.data);
    });

    this.io.on('hello', () => {
      this.emit('hello');
    });
  }

  send(type, data) {
    if (!this.io) {
      throw new Error('WebsocketClient is not connected');
    }
    this.io.emit(type, data);
  }
}

module.exports = WebsocketClient;
