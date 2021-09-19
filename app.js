var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const validator = require('express-validator');
const systemConfig = require('./configs/system');
const databaseConfig = require('./configs/database');

// Connect database MongoDatabase

mongoose.connect(`mongodb+srv://${databaseConfig.username}:${databaseConfig.password}@erp.33ll6.mongodb.net/${databaseConfig.database}`);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Custom validator items
app.use(validator({
  customValidators:{
    isNotEqual : (value1, value2)=>{
      return value1 !== value2;
    }
  }
}));


//set local variable

app.locals.systemConfig = systemConfig;


//set up router backend
app.use(`/${systemConfig.admin}`, require('./routes/backend/index'));


//set up router frontend
app.use('/', require('./routes/frontend/index'));




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
