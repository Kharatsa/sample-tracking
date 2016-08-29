'use strict';

const util = require('util');
const _ = require('lodash');
const BPromise = require('bluebird');
const log = require('server/util/logapp.js');
const ModelClient = require('server/stt/clients/modelclient.js');

/**
 * [AuthClient description]
 * @class Authorization database client
 * @param {!Object} options [description]
 * @param {!Database} options.db [description]
 * @param {!Object} options.models [description]
 * @param {!Sequelize.Model} options.models.Users [description]
 */
function AuthClient(options) {
  if (!options.db) {
    throw new Error('Database is a required parameter');
  }
  this.db = options.db;

  if (!options.models.Users) {
    throw new Error('Users model is a required parameter');
  }
  this.models = options.models;
}
util.inherits(AuthClient, ModelClient);

/**
 * Returns a copy of username converted to lowercase, and with special
 * characters removed.
 *
 * @method
 * @param  {string} username [description]
 * @return {Promise.<string>}
 */
var sanitizeUsername = BPromise.method(function(username) {
  return username.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
});

const USERNAME_MAX_LENGTH = 50;

AuthClient.prototype.all = function() {
  log.debug('Retrieving all Users');
  return this.models.Users.findAll();
};

/**
 * [getUser description]
 *
 * @method
 * @param  {!Object} options
 * @param {!string} username
 * @param {?bool} [includeCredentials=false]
 * @param {?bool} [simple=true]
 * @return {Promise.<Sequelize.Instance|Object>}
 * @throws {Error} If [options.username is undefined]
 */
AuthClient.prototype.getUser = BPromise.method(function(options) {
  options = options || {};

  const username = options.username;
  if (typeof username === 'undefined') {
    throw new Error('Missing required parameter username');
  }
  log.debug(`Retrieving User where username=${username}`);

  const params = {where: {username}};

  let UserModel = this.models.Users;

  if (options && options.includeCredentials) {
    UserModel = UserModel.scope('unsafe');
  }

  return sanitizeUsername(username)
  .then(username => UserModel.findOne({where: {username}}));
});

/**
 * @method changePassword
 * @param  {QueryOptions} options
 * @return {Promise.<Object>}
 */
AuthClient.prototype.changePassword = BPromise.method(function(options) {
  options = options || {};

  if (!(options.username && options.salt && options.digest)) {
    throw new Error('Missing required parameter username, salt, or digest');
  }

  log.debug('Username:', options.username);
  log.debug('New salt:', options.salt);
  log.debug('New digest:', options.digest);

  const getUsername = sanitizeUsername(options.username);

  const update = getUsername.then(username =>
    this.models.Users.update(
      {salt: options.salt, digest: options.digest},
      {where: {username}, fields: ['salt', 'digest']}
  ))
  .then(affectedCount => log.debug(`changePassword affected=${affectedCount}`));

  return BPromise.join(getUsername, update, (username) =>
    this.getUser({username}));
});

/**
 * [createUser description]
 *
 * @method
 * @param  {QueryOptions} options
 * @param {string} options.username [description]
 * @param {string} options.salt [description]
 * @param {string} options.digest [description]
 * @param {boolean} [options.isAdmin=false] [description]
 * @return {Promise.<Object>}
 */
AuthClient.prototype.createUser = BPromise.method(function(options) {
  options = _.defaultsDeep(options || {}, {
    isAdmin: false
  });

  if (!(options.username && options.salt && options.digest)) {
    throw new Error('Username, salt, and digest are all required parameters');
  }
  if (options.username.length > USERNAME_MAX_LENGTH) {
    throw new Error('Username must be no longer than ' + USERNAME_MAX_LENGTH +
                    ' characters. The provided username is ' +
                    options.username.length + ' characters.');
  }

  log.debug('createUser for username:', options.username);

  return sanitizeUsername(options.username)
  .then(username => {
    return this.models.Users.create({
      username,
      salt: options.salt,
      digest: options.digest,
      isAdmin: options.isAdmin
    });
  });
});

/**
 * [removeUser description]
 *
 * @method
 * @param  {!Object} options [description]
 * @param {?string} options.username [description]
 * @param {?string|number} options.id [description]
 * @param {?boolean} [options.simple=true] [description]
 * @return {Promise.<Sequelize.Instance|Object>}
 */
AuthClient.prototype.removeUser = BPromise.method(function(options) {
  if (!(options.username || options.id)) {
    throw new Error('One of username or id are required parameters');
  }
  if (options.id && options.username) {
    log.warn('Both Id and Username provided. Username param will be ignored.');
  }

  if (options.id) {
    return this.models.Users.destroy({where: {id: options.id}});
  }
  if (options.username) {
    return this.models.Users.destroy({where: {username: options.username}});
  }
});

module.exports = function(options) {
  return new AuthClient(options);
};
