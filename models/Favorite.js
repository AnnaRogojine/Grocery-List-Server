const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    CustumerID: { type: String, require: true },
    FavoriteListIds: { type: Array, require: true },
    
},{versionKey: false})

module.exports = mongoose.model('Favorite', FavoriteSchema);