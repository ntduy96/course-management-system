var application_root = __dirname,
  express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  session = require('express-session');

// initialize an express server
var app = express();

// set view engine for render
app.set('view engine', 'ejs');

// Cấu hình liên quan đến express.js
app.use(express.static(path.join(application_root, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// import routes
var routes = require('./routes');
app.use('/', routes);

// run on express server
app.listen(3000, function() {
  console.log('server is running on port 3000');
});