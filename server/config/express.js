/**
 * Express configuration
 */

 'use strict';

 var express = require('express');
 var favicon = require('serve-favicon');
 var morgan = require('morgan');
 var compression = require('compression');
 var bodyParser = require('body-parser');
 var methodOverride = require('method-override');
 var cookieParser = require('cookie-parser');
 var errorHandler = require('errorhandler');
 var path = require('path'); // provides path string manipulation (does not check for validity)
 var config = require('./environment');

 module.exports = function(app) {
    // detect 'development' || 'test' || 'production'
    var env = app.get('env');

    // change default views folder to be in server/views
    // default is 'cwd'/views
    app.set('views', config.root + '/server/views');
    // use ejs templating in .html files
    app.engine('html', require('ejs').renderFile);
    // let express know our html files are dynamic
    app.set('view engine', 'html');
    // compresses all requests
    // adds res.flush() to force partially-compressed response to be
    // flushed to the client
    app.use(compression());
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    app.use(bodyParser.json());
    // allows the usage of PUT or DELETE when its not normally available
    // original request must be 'POST' and req.method is replaced with
    // the value in the X-HTTP-Method-Override header
    app.use(methodOverride());
    // replaces req.cookies with an object of cookies
    app.use(cookieParser());

    // for production everything is compiled into the public dir
    if ('production' === env) {
       app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
       app.use(express.static(path.join(config.root, 'public'))); // serve up static content from public dir
       app.set('appPath', config.root + '/public');
       app.use(morgan('dev'));
    }

    // for development, use the local directory structure along with error-handling and live reload
    if ('development' === env || 'test' === env) {
       app.use(require('connect-livereload')());
       // serve up static content from .tmp (livereload?)
       app.use(express.static(path.join(config.root, '.tmp'))); 
       // serve up static content from client dir      
       app.use(express.static(path.join(config.root, 'client'))); 
       app.set('appPath', 'client'); 
       // http request logger
       app.use(morgan('dev')); 
       // Error handler - has to be last
       app.use(errorHandler()); 
    }
 };
