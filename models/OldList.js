const mongoose = require('mongoose');

const OldListSchema = new mongoose.Schema({
    CustumerID: [{ type: String, require: true }],
    ListName: { type: String, require: true },
    items:  [{_id: String, product_name: String, product_unit_name:String,manufacturer_id:String,product_barcode:String,
        product_description:String,quantity:Number,manufacturer_name:String}],
    date:{ type: String, require: true },
    price:{type: Number, require: true}
}, {versionKey: false})

module.exports = mongoose.model('OldList', OldListSchema);