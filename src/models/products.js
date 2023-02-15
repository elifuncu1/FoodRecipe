const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    product_id: {
        type: String,
        trim: true
    },
    product_name: {
        type: String,
        trim: true
    },
    product_price: {
        type: Number,
        trim: true
    },
    product_shop: {
        type: String,
        trim: true
    },
    category_id: {
        type : Number,
        trim : true
    },
    category_name: {
        type : String,
        trim : true
    }
   
}, { collection: 'urunler',locale: 'tr', timestamps: true });

const Admin = mongoose.model('urunler', UserSchema);

module.exports = Admin;