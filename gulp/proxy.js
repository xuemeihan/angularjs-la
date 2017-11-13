 /*jshint unused:false */

/***************

  This file allow to configure a proxy system plugged into BrowserSync
  in order to redirect backend requests while still serving and watching
  files from the web project

  IMPORTANT: The proxy is disabled by default.

  If you want to enable it, watch at the configuration options and finally
  change the `module.exports` at the end of the file

***************/

'use strict';

var httpProxy = require('http-proxy');
var chalk     = require('chalk');
var args      = require('yargs').argv;
var fs        = require('fs');
var gulp      = require('gulp');
var paths     = gulp.paths;

/*
 * Location of backend server
 */
var proxyTarget = '';

var filePath = paths.src + '/config/env/' + (args.env || 'dev') + '.json';

if (fs.existsSync(filePath)) {
  var settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  proxyTarget = settings.APP_URL || '';
}

var proxy = httpProxy.createProxyServer({
  target: proxyTarget
});

if (proxyTarget) {
  proxy.on('proxyReq', function(proxyReq) {
    proxyReq.setHeader('Origin', proxyTarget);
    proxyReq.setHeader('Referer', proxyTarget);
    proxyReq.setHeader('Host', proxyTarget.split('//')[1]);
  });
}

 proxy.on('error', function(error, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  console.error(chalk.red('[Proxy]'), error);
});

/*
 * The proxy middleware is an Express middleware added to BrowserSync to
 * handle backend request and proxy them to your backend.
 */
function proxyMiddleware(req, res, next) {
  /*
   * This test is the switch of each request to determine if the request is
   * for a static file to be handled by BrowserSync or a backend request to proxy.
   *
   * The existing test is a standard check on the files extensions but it may fail
   * for your needs. If you can, you could also check on a context in the url which
   * may be more reliable but can't be generic.
   */
  //if (/\.(html|css|js|png|jpg|jpeg|gif|ico|xml|rss|txt|eot|svg|ttf|woff|woff2|cur)(\?((r|v|rel|rev)=[\-\.\w]*)?)?$/.test(req.url)) {
  var reqStr = req.url;

  if (reqStr.indexOf('?') > -1) {
    reqStr = reqStr.split('?')[0]
  }

  if (reqStr.substr(-5) != '.json') {
    next();
  } else {
    proxy.web(req, res);
  }
}

/*
 * This is where you activate or not your proxy.
 * The first line activate it and the second one ignored it
 */
module.exports = proxyTarget ? [proxyMiddleware] : [];