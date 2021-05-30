
const mongoose = require('mongoose');

const HouseSchema = new mongoose.Schema({
    CustumerID: [{ type: String, require: true }],
    ListName: { type: String, require: true },
    items:  [{product_name: String, product_unit_name:String,manufacturer_id:String,product_barcode:String,
        product_description:String,quantity:Number,manufacturer_name:String}],
})

module.exports = mongoose.model('House', HouseSchema);