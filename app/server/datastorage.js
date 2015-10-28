'use strict';

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const Bluebird = require('bluebird');
const Sequelize = require('sequelize');
const log = require('app/server/util/log.js');
const models = require('app/server/dataschema.js');

/**
 * Maintains the database connection and models
 *
 * @param {Object} [options] description
 * @event DBStorage#ready
 */
function DBStorage(options) {
  log.debug('DBStorage storage=%s', options.storage);

  EventEmitter.call(this);
  options = options || {};
  this.db = new Sequelize(null, null, null, {
    dialect: 'sqlite',
    storage: options.storage || ':memory:',
    logging: log.debug,
    define: {
      underscored: true
    }
  });

  this.queryInterface = this.db.getQueryInterface();

  this.Forms = this.db.import('Forms', models.Forms);
  this.FormData = this.db.import('FormData', models.FormData);
  this.SampleIds = this.db.import('SampleIds', models.SampleIds);
  this.Events = this.db.import('Events', models.Events);

  this.db.sync()
  .bind(this)
  .then(function() {
    /**
     * Ready event.
     * Indicates that database initialization is completed, and that the
     * connection may be utilized for normal usage.
     * @event
     */
    this.emit('ready');
  });
}
util.inherits(DBStorage, EventEmitter);

function getPlainObject(sequelizeObj) {
  if (sequelizeObj) {
    return sequelizeObj.get({plain: true});
  }
  return null;
}

/**
 * Helper function for SELECT type queries via Sequelize
 *
 * @param  {Object}   Model    A defined Sequelize model
 * @param  {String}   whereKey The name of the column that should be used
 *                             in the 'where' portion of the SELECT.
 * @param  {Any}      params   A value or Array of values
 * @return {Array}             [description]
 */
DBStorage.prototype._execSelect = function(Model, whereKey, params) {
  var options = {};
  options.where = {};
  if (Array.isArray(params)) {
    options.where[whereKey] = {$in: params};
  } else {
    options.where[whereKey] = params;
  }
  return Model.findAll(options).map(getPlainObject);
};

DBStorage.prototype._execInsert = function(Model, params) {
  return this.db.transaction(function(tran) {
    if (Array.isArray(params)) {
      return Model.bulkCreate(params, {transaction: tran})
      .map(getPlainObject);
    } else {
      return Model.findOrCreate(params, {transaction: tran})
      .then(getPlainObject);
    }
  });
};

/**
 * @return {Array} List of table names of the database
 */
DBStorage.prototype.listTables = function() {
  return this.queryInterface.showAllTables();
};

/**
 * [saveFormList description]
 *
 * @param  {[type]} forms [description]
 * @return {[type]}       [description]
 */
DBStorage.prototype.saveFormList = function(forms) {
  log.debug('Saving forms', forms);

  var self = this;
  return this.db.transaction(function(tran) {
    return Bluebird.map(forms, function(form) {
      return {formId: form.formId, formName: form.name};
    })
    .each(function(form) {
      return self.Forms.findOrCreate({
        where: {formId: form.formId},
        defaults: {formName: form.name},
        transaction: tran
      });
      // .spread(function(form, created) {
      //   if (created) {
      //     log.info('Saved new form', form);
      //   } else {
      //     log.debug('Form already cached', form);
      //   }
      // });
    });
  });
};

module.exports = DBStorage;
