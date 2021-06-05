const express = require('express');
const { check, validationResult } = require('express-validator');
const multer  = require('multer');
const path = require('path');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const upload = multer({ storage })


const OldList = require('../models/OldList');
const { route } = require('./Maps');

const router = express.Router();

const validate = [
    check('CustumerID').exists(),
    check('CustumerID.*').notEmpty().withMessage('No id provided'),

    check('ListName')
        .isLength({ min: 1 })
        .withMessage('Name field is empity'),

    check('price').exists(),

]

// /api/OldList/:price   <==save the list in the history
router.post('/:price',  (req, res) => {
   
    const price = req.params.price;
   
    console.log("I ame here:",price);
    const errors = validationResult(req);
    var d = new Date();  
    
    // if (!errors.isEmpty()) {
    //     return res.status(422).send({ errors: errors.array() })
    // }

    const historyList = new OldList({
        CustumerID: req.body.CustumerID,
        ListName: req.body.ListName,
        items:req.body.items,
        uri:req.body.uri,
        date: d,
        price: price

    });

    historyList.save()
        .then(result => {
            res.send({
                message: 'History data created successfully',
                data: result
            })
        })
        .catch(err => {
            console.log(err); 
            res.sendStatus(500)
        })

})
//  /api/OldList/  <====get all collection
router.get('/', (req, res) => {
    
    OldList.find({})
        .then(oldlists => {
            res.send(oldlists)
        })
        .catch(err => console.log(err))
});
// /api/OldList/id  <====get all lists by costumer id
router.get('/:id', (req, res) => {
    const CustumerId = req.params.id;
    OldList.find({CustumerID:CustumerId}).sort({date: 1})
        .then(oldlists => {
            res.send(oldlists)
        })
        .catch(err => console.log(err))
});


// /api/OldList/setImage/:OldListid
router.post('/setImage/:OldlistID/', upload.single('image'),async (req, res)=>{
    const {OldlistID}= req.params;
    try{
        
        await OldList.updateOne({_id:OldlistID},{'uri':`${process.env.SERVER_URL}/uploads/${req.file.filename}`}, {upsert: true})
       
        res.sendStatus(200);
    } catch (e){
        res.send(e);
    }
})

// /api/OldList/setImage/:OldListid
router.put('/setImage/:OldlistID/', upload.single('image'),async (req, res)=>{
    const {OldlistID}= req.params;
    try{
        
        await OldList.updateOne({_id:OldlistID},{'uri':``}, {upsert: false})
       
        res.sendStatus(200);
    } catch (e){
        res.send(e);
    }
})
// /api/OldList/id <====delete list by list ID
router.delete('/:id', async (req, res) => {
    const OldListId = req.params.id;
    try {
        await OldList.findByIdAndDelete(OldListId)
        res.status(200).send();
    } catch (e) {
        res.send(e);
    }

})




module.exports = router;