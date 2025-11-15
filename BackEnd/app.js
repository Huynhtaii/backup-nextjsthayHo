var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');


// nhúng router vào ứng dụng
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var odersRouter = require('./routes/orders');
var oderdetailRouter = require('./routes/orderDetails');
var categoriesRouter = require('./routes/categories');

var app = express();
var mongoose = require('mongoose');
// kết nối đến CSDL MongoDB
mongoose.connect(
  'mongodb://localhost:27017/thayHoFramework2',)
.then(() => console.log('Kết nối DB thành công'))
.catch((err) => console.error('Kết nối DB thất bại', err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Serve ảnh từ thư mục FrontEnd/public/images
app.use('/images', express.static(path.join(__dirname, '../FrontEnd/public/images')));

// sử dụng router đã nhúng
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders',odersRouter);
app.use('/orderDetails',oderdetailRouter);
app.use('/categories',categoriesRouter);

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