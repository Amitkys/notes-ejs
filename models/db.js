// models/db.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const noteSchema = new Schema({
    title: String,
    note: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    date: {
        type: Date,
        default: () => new Date() // Use new Date() to get the current date
    },
    updatedAt: {
        type: Date,
        default: () => new Date() // Use new Date() to get the current date
    }
});

module.exports = mongoose.model('Note', noteSchema);
