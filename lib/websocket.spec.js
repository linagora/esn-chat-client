'use strict';

const sinon = require('sinon');
const expect = require('chai').expect;
const mockery = require('mockery');
const CONSTANTS = require('./constants');

describe('The websocket client', () => {
  let client, options, socketIOSpy, ioMock;

  beforeEach(() => {
    options = {
      url: 'http://localhost:8080',
      userId: '123',
      token: '456'
    };

    ioMock = {
      emit: sinon.spy(),
      on: sinon.spy()
    };

    socketIOSpy = sinon.spy(function() {
      return ioMock;
    });

    mockery.registerMock('socket.io-client', socketIOSpy);

    const WebsocketClient = require('./websocket');

    client = new WebsocketClient(options);
  });

  describe('When calling connect function', () => {
    it('should instanciate a socketIO client', () => {
      client.connect();

      expect(socketIOSpy).to.have.been.calledWith(
        `${options.url}${CONSTANTS.NAMESPACE}`,
        {
          query: `token=${options.token}&user=${options.userId}`,
          forceNew: true
        }
      );
    });

    it('should subscribe to the default chat room', function() {
      client.connect();

      expect(ioMock.emit).to.have.been.calledWith('subscribe', CONSTANTS.DEFAULT_ROOM);
    });

    describe('on socketIO "connect" event', () => {
      it('should emit "connect" event', () => {
        const onSpy = sinon.spy();

        client.on('connect', onSpy);
        client.connect();

        expect(ioMock.on).to.have.been.calledWith('connect', sinon.match.func.and(sinon.match(handler => {
          handler();

          return true;
        })));
        expect(onSpy).to.have.been.called;
      });
    });

    describe('on socketIO "disconnect" event', () => {
      it('should emit "disconnect" event', () => {
        const onSpy = sinon.spy();

        client.on('disconnect', onSpy);
        client.connect();

        expect(ioMock.on).to.have.been.calledWith('disconnect', sinon.match.func.and(sinon.match(handler => {
          handler();

          return true;
        })));
        expect(onSpy).to.have.been.called;
      });
    });

    describe('on socketIO "message" event', () => {
      it('should emit "message" with payload data', () => {
        const onSpy = sinon.spy();
        const message = {data: {foo: 'bar'}};

        client.on('message', onSpy);
        client.connect();

        expect(ioMock.on).to.have.been.calledWith('message', sinon.match.func.and(sinon.match(handler => {
          handler(message);

          return true;
        })));
        expect(onSpy).to.have.been.calledWith(message.data);
      });
    });

    describe('on socketIO "hello" event', () => {
      it('should emit "hello" event', () => {
        const onSpy = sinon.spy();

        client.on('hello', onSpy);
        client.connect();

        expect(ioMock.on).to.have.been.calledWith('hello', sinon.match.func.and(sinon.match(handler => {
          handler();

          return true;
        })));
        expect(onSpy).to.have.been.called;
      });
    });
  });

  describe('The send function', () => {
    it('should throw error when not connected', () => {
      try {
        client.send();
      } catch (err) {
        expect(err.message).to.match(/Client is not connected/);
      }
    });

    it('should emit input data', () => {
      const type = 'message';
      const data = {foo: 'bar'};

      client.connect();
      client.send(type, data);

      expect(ioMock.emit).to.have.been.calledWith(type, data);
    });
  });
});
