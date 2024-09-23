const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var methodOverride = require('method-override');
const session = require('express-session');
const Notes = require('./models/db');
const passport = require('./config/auth');
const app = express();

// Middleware for handling sessions
app.use(session({
    secret: 'OCSPX-sqwqm5GzTLjfBgEmA7OBEii7rgtP',
    resave: false,
    saveUninitialized: true
  }));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes for authentication
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/auth/google' }),
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


mongoose.connect('mongodb://localhost:27017/note')
.then(() => {console.log('connected to db')}).catch((e) => console.log('error to connect db', e));

// home 
app.get("/", isLoggedIn, async(req, res) => {
    const all_note = await Notes.find({ userId: req.user._id });
    res.render('routes/index.ejs', {all_note});
});
// Get notes by id - ensure the note belongs to the user
app.get('/note/:id', async(req, res) => {
    const id = req.params.id;
    const data = await Notes.findOne({ _id: id, userId: req.user._id }); // Check ownership
    if (data) {
        res.render('routes/singleData.ejs', { data });
    } else {
        res.status(403).send('You are not authorized to view this note.');
    }
})
// open form for create note
app.get('/create', (req, res) => {
    res.render('routes/create.ejs');
})
// add new data
app.post('/note', async(req, res) => {
    const newNote = {title: req.body.title, note: req.body.note};
    const createdNote = await Notes.create(newNote);
    // after add, go to home
   res.redirect('/');
})
// open form with current data
app.get('/update/:id', async(req, res) => {
    const id = req.params.id;
    const data = await Notes.findById(id);
    res.render('routes/update.ejs', {data})
});
// update note of specified id
app.put('/note/:id', async(req, res) => {
    const id = req.params.id;
    const newNote = {title: req.body.title, note: req.body.note, updatedAt: new Date()};
    const updatedNote = await Notes.findByIdAndUpdate(id, newNote, { new: true });
    res.redirect('/');
})

// delete notes
app.delete("/note/:id", async(req, res) => {
    const id = req.params.id;
    const deletedNote = await Notes.findByIdAndDelete(id);
    res.json({msg: 'notes delete'});
    
})


app.listen(3000, () => console.log('listening on 3000'));
