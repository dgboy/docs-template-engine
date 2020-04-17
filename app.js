const express = require('express');
const app = express();
const path = require('path');

app.use('/', express.static(path.join(__dirname, 'client')));

// ROUTES
// let routes = require('./app/server/routes/index');
// app.use('/', routes);

module.exports = app;
