var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
// http://localhost:8080/views/starterpage
var starter = require('./routes/starterpage');

var app = express();

var fs = require('fs');
var cheerio = require('cheerio');
var Crawler = require("js-crawler");

app.get('/scrape', function(req, res) {

  // scraping action here
  console.log("Hey, scraping supposedly in motion!");

  var theStudios = [{name: "nss", site: "http://nashvillesoftwareschool.com/"}, {name: "kaliyuga", site: "http://www.kaliyugayoga.com/Instructors.html"}];

  // will pass as callback in printStudios to scrape individual site
  function findYoga(locationYoga) {
    new Crawler().configure({depth: 1}).crawl(locationYoga.site, function onSuccess(page) {
      console.log("current site: " + locationYoga.site);

      var $ = cheerio.load(page.content);

      var findh2, letsSee;

      var json = { findh2 : "", letsSee : ""};

    fs.writeFile('locations/yogaplan-' + locationYoga.name + '.html', page.content, function(err) {
      console.log("Time to check project directory! file: yogaplan-" + locationYoga.name);
      });
    }); //end: new Crawler
  };

  // will loop through each studio in theStudios and initiate scraping action
  function printStudios(callback) {

  for (var i = 0; i < theStudios.length; i++) {
    console.log("value of i pre-crawler: " + i);

    callback(theStudios[i]);

    console.log("when does this part happen? " + i);

    var nextUp = theStudios[i];
    var nextUpNumb = i;

   }; // end: for loop
  }; // end: printStudios

  printStudios(findYoga);

}); // end: scraping

app.listen('8081');

console.log('Things will happen on port 8081 it seems');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/starter', starter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;