/**
 * Created by dilip on 8/1/17.
 */
"use strict";

const hmqClient = require('hmq-client')

const appConfig = require('./app')

/** OneLogin Service Connection **/

module.exports.onelogin = hmqClient(appConfig.services.onelogin);




/** ACL Service Connection **/
module.exports.eye = {};
module.exports.message = {};
