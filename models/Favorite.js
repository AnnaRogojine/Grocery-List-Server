const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    CustumerID: { type: String, require: true },
    HistoryID: { type: String, require: true },
    isFav:{type:Boolean, require: true}
},{versionKey: false})

module.exports = mongoose.model('Favorite', FavoriteSchema);