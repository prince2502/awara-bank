var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');

var express = require('express');
var app = express();

app.get('/sign-up', function(request, response){

	var readStream = fileSystem.createReadStream('./signup.html');
    readStream.pipe(response);
});

// handle the user base route
app.get('/user', function(request, response){

	var readStream = fileSystem.createReadStream('./user.html');
    readStream.pipe(response);
});

// handle the base route
app.get('/', function(request, response){

	var readStream = fileSystem.createReadStream('./index.html');
    readStream.pipe(response);
});

app.use('/views', express.static('views'));
app.use('/controllers', express.static('controllers'));
app.use('/models', express.static('models'));
app.use('/services', express.static('services'));
app.use('/css', express.static('css'));

// start the server 
app.listen(8080);