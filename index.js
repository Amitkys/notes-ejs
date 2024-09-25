const express = require('express');
require('dotenv').config();
const path = require('path');

const engine = require('ejs-mate');
const bodyParser = require('body-parser');
const validateRequestBody = require('./joy');
const mongoose = require('mongoose');
var methodOverride = require('method-override');
const session = require('express-session');
const Notes = require('./models/db');
const passport = require('./config/auth');
// require('dotenv').config();
const flash = require('connect-flash');
const app = express();



// Middleware for handling sessions
app.use(session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 3 * 24 * 60 * 60 * 1000,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        httpOnly: true
      }
  }));

// Passport middleware and session
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes for authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  }
);


app.get('/logout', (req, res) => {
    req.logout(err => {
      if (err) return next(err);
      res.redirect('/');
    });
  });

app.get('/login', (req, res) => {
    res.render('auth/login.ejs');
})

// Middleware to check authentication
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.render('auth/login.ejs');
  }

  app.get('/dashboard', isLoggedIn, (req, res) => {
    res.send(`Hello ${req.user.name}, you are logged in!`);
  });

// Use ejs-mate for all ejs templates:
app.engine('ejs', engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // Set EJS as the view engine

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))


mongoose.connect(process.env.DATABASE_URL)
.then(() => {console.log('connected to db')}).catch((e) => console.log('error to connect db', e));

// middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.warning = req.flash("warning");
    res.locals.loggedInUser = req.user;
    res.locals.formTempData = req.flash('formTempData')[0] || {}; // Retrieve form data or use empty object
    next();
  })

// home 
app.get("/", isLoggedIn, async(req, res) => {
    const all_note = await Notes.find({ userId: req.user._id });
    res.render('routes/index.ejs', {all_note});
});
app.get('/test', (req, res) => {
    
})
// Get notes by id - ensure the note belongs to the user
app.get('/note/:id', isLoggedIn, async(req, res) => {
    const id = req.params.id;
    const data = await Notes.findOne({ _id: id, userId: req.user._id }); // Check ownership
    if (data) {
        res.render('routes/singleData.ejs', { data });
    } else {
        res.status(403).send('You are not authorized to view this note.');
    }
})
// open form for create note
app.get('/create', isLoggedIn, (req, res) => {
    res.render('routes/create.ejs');
})
// add new data
app.post('/note', validateRequestBody, isLoggedIn, async(req, res) => {
    const formTempData = req.flash('formTempData')[0] || {};
    console.log(formTempData);
    const newNote = {
        title: req.body.title,
        note: req.body.note,
        userId: req.user._id // Associate with the logged-in user
    };
    const createdNote = await Notes.create(newNote);
    req.flash("success", "Notes Saved.");
    // after add, go to home
   res.redirect('/');
})
// open form with current data
app.get('/update/:id', isLoggedIn, async(req, res) => {
    const id = req.params.id;
    const data = await Notes.findOne({ _id: id, userId: req.user._id }); // Check ownership
    if (data) {
        
        res.render('routes/update.ejs', { data });
    } else {
        res.status(403).send('You are not authorized to edit this note.');
    }
});
// update note of specified id
app.put('/note/:id', validateRequestBody, async(req, res) => {
    const id = req.params.id;
    const newNote = { title: req.body.title, note: req.body.note, updatedAt: new Date() };
    const updatedNote = await Notes.findOneAndUpdate({ _id: id, userId: req.user._id }, newNote, { new: true });
    if (updatedNote) {
        req.flash("success", "Notes Updated.")
        res.redirect('/');
    } else {
        res.status(403).send('You are not authorized to update this note.');
    }
})

// Delete notes - ensure the note belongs to the user
app.delete('/note/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const deletedNote = await Notes.findOneAndDelete({ _id: id, userId: req.user._id }); // Check ownership
    if (deletedNote) {
        res.json({ msg: 'Note deleted' });
    } else {
        res.status(403).send('You are not authorized to delete this note.');
    }
});


app.listen(3000, () => console.log('listening on 3000'));
