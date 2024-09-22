const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const app = express();

// .......................................................................
// Middleware to parse URL-encoded bodies (form data)
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Set view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, './public')));
app.use(methodOverride('_method'));
// ........................................................................





app.listen(3000, () => console.log('listening on 3000'));