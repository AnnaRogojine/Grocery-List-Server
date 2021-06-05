const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const axios = require('axios');

const fs = require('fs');

require('dotenv').config();

const User = require('../models/User');
const Request = require('../models/Request');
const House = require('../models/House');


//define validation for product inputs
const validateInput = [
    check('productName').isLength({ min: 2 }).withMessage('Product name inValid. Must contain atleast 2 characters'),
    //email is to add another user to list
    //check('email').isEmail().withMessage('Please provide a valid email'),
]

// route -> /api/list/findItemByName
router.post('/findItemByName', validateInput, async (req, res) => {

    // validate data against validation rules in "validateProduct"
    const errors = validationResult(req);

    if (!errors.isEmpty()) { //if we have an input error
        return res.status(400).json({ errors: errors.array() });

    } else {
        //extract product name from req.body
        const productName = req.body.productName;

        //http call to get all products info'
        const result = await axios.post('https://api.superget.co.il/',
            `action=GetProductsByName&product_name[]=${productName}&limit=30&api_key=ca450409788fb68cd7ecd1e5947afd0d48571d86`,
            {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                    "charset": "utf-8"
                }
            })
            .then((productData) => {
                fs.writeFile('./test.txt', JSON.stringify(productData.data), function (err) {
                    if (err) return console.log(err);
                    console.log('Data in file!');

                });
                console.log('data', productData.data);
                const Pdata = JSON.stringify(productData.data);
                if (!Pdata) return res.status(404).send({ success: false, message: 'No Data' });

                // attaching the data to the header of our response:
                res.send({ success: true, message: 'Fetch Data Succesfuly', Pdata })
            })
            .catch((err) => {
                console.log('error', err)
            })
    }
});

// route -> /api/list/addUserToList
router.post('/addUserToList', async (req, res) => {

    //get the users email we want to add, get the personId that added and listID to add the new user

    const errors = validationResult(req);

    if (!errors.isEmpty()) { //if we have an input error
        return res.status(400).json({ errors: errors.array() });
    }

    //check if email exist in system
    const user = await User.findOne({ email: req.body.email.toLowerCase() })
    if (!user) {
        //check if user we want to add to list exist in system 
        return res.status(400).send({ success: false, message: 'User Is Not Exist In System' });
    }

    //check input --> if user is trying to add his own email, get error message
    // curr_user == the sender
    const curr_user = await User.findOne({ _id: req.body.Requests.senderId });
    if (user.email == curr_user.email) {
        return res.status(400).send({ success: false, message: "Oops! You are trying to add yourself." });
    }

    //check if user we want to add already has this list
    const existInList = await House.findOne({ _id: req.body.Requests.listId , CustumerID: user._id})
    if(existInList){
        return res.status(400).send({ success: false, message: "Oops! You are trying to add an existing user." });
    }

    //check if user we want to add has already requests array in DB
    const requestUser = await Request.findOne({ CustumerID: user._id });
    if (!requestUser) {
        //create new request 
        const request = new Request({
            CustumerID: user._id,
            Requests: req.body.Requests
        });
        //console.log(request);
        //store new request in DB
        request.save()
            .then(result => {
                res.send({
                    success: true,
                    message: 'Request created successfully',
                    data: result
                })
            })
            .catch(err => console.log(err))

        // return .....
    }
    else {

        // ///test !! : {senderId : String, senderName : String, listId : String, ListName : String}
        // console.log("in");
        // console.log("sender: " + req.body.Requests.senderId);
        // console.log("listId: " + req.body.Requests.listId);


        //add the request to exist user in DB.
        // First we will check end cases -->
        // if a user wants to associate the same user to the same list multiple times

        const Is_request_exist = await Request
            .findOne({
                CustumerID: user._id,
                Requests: {
                    $elemMatch: {
                        senderId: req.body.Requests.senderId, senderName: req.body.Requests.senderName,
                        listId: req.body.Requests.listId, listName: req.body.Requests.listName
                    }
                }
            });


        if (Is_request_exist) {
            return res.status(400).send({ success: false, message: 'You have already sent this request' });
        }

        //add request to DB:
        Request.findOne({ CustumerID: user._id })
            .then(request => {
                request.Requests.push(req.body.Requests)
                return request.save();
            })
            .then(result => {
                //res.send(result);
                res.send({
                    success: true,
                    message: 'Request created successfully',
                    data: result
                })
            })
            .catch(err => console.log(err));
    }
});




// route -> /api/list/pullAllRequests
router.get('/pullAllRequests/:id', (req, res) => {
    //Get from DB all requests
    const CustumerId = req.params.id;
    Request.find({ CustumerID: CustumerId })
        .then(requests => {
            //console.log(requests);
            res.send({ success: true, message: 'Fetch Data Succesfuly', requests })
        })
        .catch(err => console.log(err))
});



// route -> /api/list/UserRefuseJoinToList
// User dont want to be part of list
router.post('/UserRefuseJoinToList', async (req, res) => {
    const { custumerId, requestId } = req.body;
    //delete request from Requests array
    await Request.updateOne({ CustumerID: custumerId }, { "$pull": { "Requests": { "_id": requestId } } })
    res.send({ success: true, message: 'The Request Was Successfully Rejected' })

});


// route -> /api/list/UserAcceptJoinToList
router.post('/UserAcceptJoinToList', async (req, res) => {
    const { listId, custumerId, requestId } = req.body;

    // Delete the request from 'Request array'
    await Request.updateOne({ CustumerID: custumerId }, { "$pull": { "Requests": { "_id": requestId } } })

    //Add user to wanted list
    House.findById(listId)
        .then(houses => {
            houses.CustumerID.push(custumerId)
            return houses.save();
        })
        .then(result => {
            //res.send(result);
            res.send({ success: true, message: 'The Request Was Successfully Accepted', result });
        })
        .catch(err => console.log(err));

});



module.exports = router;