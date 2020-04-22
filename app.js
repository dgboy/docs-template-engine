const express = require('express');
const app = express();

app.use('/', express.static(__dirname + '/client'));
console.log("Work!");

// ROUTES
// let routes = require('./app/server/routes/index');
// app.use('/', routes);

module.exports = app;
