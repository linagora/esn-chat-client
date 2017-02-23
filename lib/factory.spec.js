'use strict';

const mockery = require('mockery');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('The chat client factory', () => {
  let requestMock, ClientMock, module, options, token, userId;

  beforeEach(() => {
    token = '123456789';
    userId = '1';
    options = { url: 'http://open-paas.org', username: 'Bruce', password: 'secret' };
    requestMock = {};

    ClientMock = class {
      constructor(options) {
        this.options = options;
      }
    };

    mockery.registerMock('request-promise-native', requestMock);
    mockery.registerMock('./websocket', ClientMock);

    module = require('./factory');
  });

  describe('The get function', () => {
    it('should reject when auth token endpoint throws error', done => {
      const error = new Error('I failed');

      requestMock.post = sinon.spy(() => Promise.resolve({_id: 1}));

      requestMock.get = sinon.spy((url, opts) => {
        expect(url).to.equal(`${options.url}/api/authenticationtoken`);
        expect(opts).to.deep.equal({ jar: true, json: true });

        return Promise.reject(error);
      });

      module.get(options).then(() => {
        done(new Error());
      }, err => {
        expect(requestMock.get).to.have.been.called;
        expect(requestMock.post).to.have.been.called;
        expect(err.message).to.equal(error.message);
        done();
      });
    });

    it('should reject when auth token does not return token', done => {
      requestMock.post = sinon.spy(() => Promise.resolve({_id: 1}));

      requestMock.get = sinon.spy((url, opts) => {
        expect(url).to.equal(`${options.url}/api/authenticationtoken`);
        expect(opts).to.deep.equal({ jar: true, json: true });

        return Promise.resolve({});
      });

      module.get(options).then(() => {
        done(new Error());
      }, err => {
        expect(requestMock.get).to.have.been.called;
        expect(requestMock.post).to.have.been.called;
        expect(err.message).to.match(/Token not found/);
        done();
      });
    });

    it('should reject when login endpoint throws error', done => {
      const error = new Error('I failed');

      requestMock.get = sinon.spy();
      requestMock.post = sinon.spy((url, opts) => {
        expect(url).to.equal(`${options.url}/api/login`);
        expect(opts).to.deep.equal({
          form: { username: options.username, password: options.password },
          jar: true, json: true
        });

        return Promise.reject(error);
      });

      module.get(options).then(() => {
        done(new Error());
      }, err => {
        expect(requestMock.post).to.have.been.called;
        expect(requestMock.get).to.not.have.been.called;
        expect(err.message).to.equal(error.message);
        done();
      });
    });

    it('should instanciate the WebsocketClient', done => {
      requestMock.post = sinon.spy((url, opts) => {
        expect(url).to.equal(`${options.url}/api/login`);
        expect(opts).to.deep.equal({
          form: { username: options.username, password: options.password },
          jar: true, json: true
        });

        return Promise.resolve({_id: userId});
      });

      requestMock.get = sinon.spy((url, opts) => {
        expect(url).to.equal(`${options.url}/api/authenticationtoken`);
        expect(opts).to.deep.equal({ jar: true, json: true });

        return Promise.resolve({token});
      });

      module.get(options).then(client => {
        expect(client).to.be.an.object;
        expect(client.options).to.deep.equals({ token: token, url: options.url, userId: userId });
        expect(requestMock.post).to.have.been.called;
        expect(requestMock.get).to.have.been.called;
        done();
      }, done);
    });
  });
});
