'use strict';

var helpers = require('targaryen/lib/test-helpers');
var Oolong = require('oolong');

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

    var root = helpers.getFirebaseData();
    var rules = helpers.getFirebaseRules();
    var positivity = this._targaryenPositivity;
    var operationType = this._targaryenOperation;

    if (operationType === 'read') {

      var readResult = rules.tryRead(path, root, this.actual);
      if (positivity) {
        this.assert(readResult.allowed === true,
          helpers.unreadableError(readResult));
      } else {
        this.assert(readResult.allowed === false,
          helpers.readableError(readResult));
      }

    } else if (operationType === 'write') {
      var newData = this._targaryenOperationData || null;
      var writeResult = rules.tryWrite(path, root, newData, this.actual);

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

mustTargaryen.users = helpers.userDefinitions;
mustTargaryen.setFirebaseData = helpers.setFirebaseData;
mustTargaryen.setFirebaseRules = helpers.setFirebaseRules;

module.exports = mustTargaryen;
