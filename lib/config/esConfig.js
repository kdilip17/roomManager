/**
 * Created by dilip on 8/1/17.
 */
"use strict";

var elasticsearch = require('elasticsearch');
var appConfig = require('./app');

var esClient = new elasticsearch.Client(appConfig.database.es);

module.exports = esClient;
