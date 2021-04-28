const express = require('express');
const { check, validationResult } = require('express-validator');

const OldList = require('../models/OldList');

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
router.post('/:price', validate, (req, res) => {
    const price = req.params.price;
   

    const errors = validationResult(req);
    var d = new Date();  
    
    if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array() })
    }

    const historyList = new OldList({
        CustumerID: req.body.CustumerID,
        ListName: req.body.ListName,
        items:req.body.items,
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
        .catch(err => console.log(err))

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
    OldList.find({CustumerID:CustumerId}).sort({date: -1})
        .then(oldlists => {
            res.send(oldlists)
        })
        .catch(err => console.log(err))
});


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