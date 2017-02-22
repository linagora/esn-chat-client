'use strict';

const mockery = require('mockery');
const chai = require('chai');

before(() => {
  chai.use(require('chai-shallow-deep-equal'));
  chai.use(require('sinon-chai'));
  chai.use(require('chai-as-promised'));
});

beforeEach(() => {
  mockery.enable({warnOnReplace: false, warnOnUnregistered: false, useCleanCache: true});
});

afterEach(() => {
  mockery.resetCache();
  mockery.deregisterAll();
  mockery.disable();
});
