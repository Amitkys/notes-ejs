const express = require('express');
const path = require('path');
const engine = require('ejs-mate');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Notes = require('./db/db');
const app = express();

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

app.get('/kys', (req, res) => {
    res.render('routes/index.ejs');
})

mongoose.connect('mongodb://localhost:27017/note')
.then(() => {console.log('connected to db')}).catch((e) => console.log('error to connect db', e));

app.get("/", async(req, res) => {
    const all_note = await Notes.find({});
    res.render('routes/index.ejs', {all_note});
});

app.get('/note/:id', async(req, res) => {
    const id = req.params.id;
    const data = await Notes.findById(id);
    res.render('routes/singleData.ejs', {data})
})

app.get('/create', (req, res) => {
    res.render('routes/create.ejs');
})

app.post('/note', async(req, res) => {
    const newNote = {title: req.body.title, note: req.body.note};
    const createdNote = await Notes.create(newNote);
    // console.log(createdNote);
    res.json({msg: 'notes created', noteId: createdNote._id});
})
// update
app.get('/update/:id', async(req, res) => {
    const id = req.params.id;
    const data = await Notes.findById(id);
    // const newNote = {title: req.body.title, note: req.body.note};
    // const updatedNote = await Notes.findByIdAndUpdate(id, newNote);
    res.render('routes/update.ejs', {data})
})
app.get("/note", async(req, res) => {
    const all_note = await Notes.find({});
    res.json({all_note});
});
app.delete("/note/:id", async(req, res) => {
    const id = req.params.id;
    const deletedNote = await Notes.findByIdAndDelete(id);
    res.json({msg: 'notes delete'});
    
})


app.listen(3000, () => console.log('listening on 3000'));
