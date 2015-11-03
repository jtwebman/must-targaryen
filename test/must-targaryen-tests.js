'use strict';

var expect = require('must');
var targaryen = require('targaryen');
var mustTargaryen = require('../index');
mustTargaryen(expect);

describe('Must test targaryen asserts', function() {
  it('can read works', function() {
    mustTargaryen.setFirebaseRules({ rules: {
      '.read': true
    }});
    mustTargaryen.setFirebaseData({});
    expect(mustTargaryen.users.unauthenticated).can.read.path('/users');
  });

  it('cannot read works', function() {
    mustTargaryen.setFirebaseRules({ rules: {
      '.read': 'auth != null'
    }});
    mustTargaryen.setFirebaseData({});
    expect(mustTargaryen.users.unauthenticated).cannot.read.path('/users');
  });

  it('can read with auth password only', function() {
    mustTargaryen.setFirebaseRules({ rules: {
      users: {
        '.read': 'auth != null && auth.provider == "password"'
      }
    }});
    mustTargaryen.setFirebaseData({});
    expect(mustTargaryen.users.password).can.read.path('/users');
    expect(mustTargaryen.users.anonymous).cannot.read.path('/users');
    expect(mustTargaryen.users.google).cannot.read.path('/users');
    expect(mustTargaryen.users.github).cannot.read.path('/users');
    expect(mustTargaryen.users.twitter).cannot.read.path('/users');
    expect(mustTargaryen.users.facebook).cannot.read.path('/users');
    expect(mustTargaryen.users.unauthenticated).cannot.read.path('/users');
  });

  it('can write if auth by password', function() {
    mustTargaryen.setFirebaseRules({ rules: {
      users: {
        '.write': 'auth != null && auth.provider == "password"'
      }
    }});
    mustTargaryen.setFirebaseData({
      users: {}
    });
    expect(mustTargaryen.users.password).can.write({
      '1': {
        name: 'Test',
        email: 'email@email.com'
      }
    }).path('/users');
  });

  it('cannot write when missing required keys', function() {
    mustTargaryen.setFirebaseRules({ rules: {
      users: {
        '.write': 'auth != null && auth.provider == "password"',
        '$id': {
          '.validate': 'newData.hasChildren(["name","email"])',
          name: {
            '.validate': 'newData.isString()'
          },
          email: {
            '.validate': 'newData.isString()'
          },
          '$other': {
            '.validate': false
          }
        }
      }
    }});
    mustTargaryen.setFirebaseData({
      users: {}
    });
    expect(mustTargaryen.users.password).cannot.write({
      '1': {
        name: 'Test'
      }
    }).path('/users');
  });

  it('cannot write when I am not allowing extra keys', function() {
    mustTargaryen.setFirebaseRules({ rules: {
      users: {
        '.write': 'auth != null && auth.provider == "password"',
        '$id': {
          name: {
            '.validate': 'newData.isString()'
          },
          email: {
            '.validate': 'newData.isString()'
          },
          '$other': {
            '.validate': false
          }
        }
      }
    }});
    mustTargaryen.setFirebaseData({
      users: {}
    });
    expect(mustTargaryen.users.password).cannot.write({
      '1': {
        name: 'Test',
        email: 'email@email.com',
        shouldNotBeHere: true
      }
    }).path('/users');
  });
});
