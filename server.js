const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// View engine setup (ejs)
app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');

// ejs-layout setting
app.set('layout', './partials/layout');
app.set("layout extractScripts", true);
app.use(expressLayouts);

// Bootstrap & Jquery
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

let login = require("./app/routes/auth/login.js")();
app.use('/', login);

// simple route
let user = require("./app/routes/routes.js")(app);
app.use('/', user);

// set port, listen for requests
app.listen(3003, () => {
  console.log("Server is running on port 3003.");
});