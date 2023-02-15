const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    Recipe_CustomID: {
        type: Number,
        trim: true
    },
    Ingredients_CustomID: {
        type: Number,
        trim: true
    },
    active:{
        type: String,
        trim: true
    }
}, { collection: 'Counts',locale: 'tr', timestamps: true });

const Admin = mongoose.model('Counts', UserSchema);

module.exports = Admin;