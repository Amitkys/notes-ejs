const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
    title: String,
    note: String,
    date: {
        type: Date,
        default: () => new Date() // Use new Date() to get the current date
    }
});

module.exports = mongoose.model('Note', noteSchema);
