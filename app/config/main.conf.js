'use strict';

/**
 * Environments based configuration
 *
 * All patterns "___var_name" will be replaced with values from config/env/{dev|production|...}.json
 * Gulp task: config.js
 * Usage: gulp build --env=production
 */

var app = angular.module('app');

app.constant('ENV', '___env_name').constant('_', window._);