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
  console.log("Hey, scraping in motion!");

  var theStudios = [{studio_id: 1, name: "kaliyuga", site: "http://www.kaliyugayoga.com/Instructors.html"}, 
    {studio_id: 2, name: "12southyoga", site: "http://12southyoga.com/classes/"},
    {studio_id: 3, name:"yoga_harmony", site:"http://www.yogaharmonynashville.com/classes.html"},
    {studio_id: 4, name: "hot_yoga_of_east_nashville", site: "http://hotyogaeastnashville.com/classes-and-schedule/"},
    {studio_id: 5, name: "steadfast_and_true_yoga", site: "http://www.steadfastandtrueyoga.com/classes/schedule/"}];

  // will pass as callback in printStudios to scrape individual site
  function findYoga(locationYoga) {

    new Crawler().configure({depth: 1}).crawl(locationYoga.site, function onSuccess(page) {
      
      console.log("current site: " + locationYoga.site);

      var $ = cheerio.load(page.content);

    fs.writeFile('locations/yogaplan-' + locationYoga.studio_id + '.html', page.content, function(err) {
      console.log("Time to check project directory! file: yogaplan-" + locationYoga.name);
        });
      }, 

      // Handling errors in page retrieval/file printing
      function(response) {console.log("Printing error occurred for: " + response.url);

      fs.writeFile('locations/yogaplan-' + 'FAILED-TO-PRINT-' + locationYoga.name + '.html', "Error printing for this site - error response is: " + response.status, function(err) {
        console.log("Time to check project directory! file: yogaplan-" + locationYoga.name + 'FAILED-TO-PRINT');
        console.log("response status: " + response.status);
      });      
    }); //end: new Crawler
  }; // end: findYoga

  // will loop through each studio in theStudios and initiate scraping action
  function printStudios(callback) {

  for (var i = 0; i < theStudios.length; i++) {

    callback(theStudios[i]);

   }; // end: for loop
  }; // end: printStudios


  printStudios(findYoga);

}); // end: scraping action

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
