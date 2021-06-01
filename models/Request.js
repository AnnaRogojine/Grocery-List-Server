const mongoose = require('mongoose');
//Each user has his own array of requests
//sender : _id --> who send the request
//list_name : list name
//list_id : _id --> list id that the sender want to share with
const RequestSchema = new mongoose.Schema({
    CustumerID: { type: String, require: true },
    Requests:  [{senderId : String, senderName : String, listId : String, ListName : String}]
})

module.exports = mongoose.model('Request', RequestSchema);