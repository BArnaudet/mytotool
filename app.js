var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

var flash = require('express-flash');
var session = require('express-session');
var mysql = require('mysql');
var connection  = require('./db');
const favicon = require('express-favicon');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tasksRouter = require('./routes/tasks');

var app = express();

const corsOption = {
    origin: '*'
}
app.use(cors(corsOption))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/images/favicon.ico'));

app.use(session({
    cookie: { maxAge: 60000 },
    store: new session.MemoryStore,
    saveUninitialized: true,
    resave: 'true',
    secret: 'secret'
}))

app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/tasks', tasksRouter);

module.exports = app;