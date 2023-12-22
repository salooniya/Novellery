const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    novelID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

const novelSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    agree: {
        type: Boolean,
        required: true
    },
    mature: {
        type: Boolean,
        required: true
    },
    cover_image: {
        type: String,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    chapters: [String]
});

const Novel = mongoose.model('Novel', novelSchema);
const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = { Novel, Chapter };
