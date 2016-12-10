'use strict';

var targaryen = require('targaryen');
var Oolong = require('oolong');

var helpers = targaryen.util;

function mustTargaryen(Must) {
  Oolong.defineGetter(Must.prototype, 'can', function() {
    this._targaryenPositivity = true;
    return this;
  });

  Oolong.defineGetter(Must.prototype, 'cannot', function() {
    this._targaryenPositivity = false;
    return this;
  });

  Oolong.defineGetter(Must.prototype, 'read', function() {
    this._targaryenOperation= 'read';
    return this;
  });

  Must.prototype.write = function(data) {
    this._targaryenOperation = 'write';
    this._targaryenOperationData = data;
    return this;
  };

  Must.prototype.path = function(path) {
    helpers.assertConfigured();

    var database = helpers.getFirebaseData().as(this.actual);
    var positivity = this._targaryenPositivity;
    var operationType = this._targaryenOperation;

    if (operationType === 'read') {

      var readResult = database.read(path);
      if (positivity) {
        this.assert(readResult.allowed === true,
          helpers.unreadableError(readResult));
      } else {
        this.assert(readResult.allowed === false,
          helpers.readableError(readResult));
      }

    } else if (operationType === 'write') {
      var newData = this._targaryenOperationData || null;
      var writeResult = database.write(path, newData);

      if (positivity) {
        this.assert(writeResult.allowed === true,
          helpers.unwritableError(writeResult));
      } else {
        this.assert(writeResult.allowed === false,
          helpers.writableError(writeResult));
      }
    }

    return this;
  };
}

mustTargaryen.users = helpers.users;
mustTargaryen.setFirebaseData = helpers.setFirebaseData;
mustTargaryen.setFirebaseRules = helpers.setFirebaseRules;

module.exports = mustTargaryen;
