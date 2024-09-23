const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Notes = require('./db/db');

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

mongoose.connect('mongodb://localhost:27017/note')
.then(() => {console.log('connected to db')}).catch((e) => console.log('error to connect db', e));

app.get('/', async(req, res) => {
    const all_note = await Notes.find({});
    // console.log(all_note);
    res.render('routes/index.ejs', {all_note});
})



app.get('/:id', async(req, res) => {
    const id = req.params.id; 
    const data = await Notes.findById(id);
    res.render('routes/singleNote.ejs', {data});
    
})


// app.post('/note', async(req, res) => {
//     const newNote = {title: req.body.title, note: req.body.note};
//     const createdNote = await Notes.create(newNote);
//     // console.log(createdNote);
//     res.json({msg: 'notes created', noteId: createdNote._id});
// })
// app.get('/note/:id', async(req, res) => {
//     res.render('/routes/singleNote.ejs')
// })
// app.put('/note/:id', async(req, res) => {
//     const id = req.params.id;
//     const newNote = {title: req.body.title, note: req.body.note};
//     const updatedNote = await Notes.findByIdAndUpdate(id, newNote);
//     res.json({msg: 'Note Updated'});
// })

// app.delete("/note/:id", async(req, res) => {
//     const id = req.params.id;
//     const deletedNote = await Notes.findByIdAndDelete(id);
//     res.json({msg: 'notes delete'});

// })



app.listen(3000, () => console.log('listening on 3000'));