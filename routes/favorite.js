const express = require('express');
const { check, validationResult } = require('express-validator');

const Favorite = require('../models/Favorite');
const OldList = require('../models/OldList');

const router = express.Router();

const validate = [
    check('CustumerID').exists(),
    check('CustumerID').notEmpty().withMessage('No Cid provided'),

    // check('HistoryID').exists(),
    // check('HistoryID').notEmpty().withMessage('No Hid provided'),


]

// /api/favorite/:CostumerID/:Historylistid   <==save the list in the history
router.post('/:Cid/:Hid', validate, (req, res) => {
    const { Cid, Hid } = req.params;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array() })
    }

    const FavoriteList = new Favorite({
        CustumerID: Cid,
        HistoryID: Hid,
        isFav:true

    });

    FavoriteList.save()
        .then(result => {
            res.send({
                message: 'FavoriteList  data created successfully',
                data: result
            })
        })
        .catch(err => console.log(err))

})
//  /api/favorite/costumerId  <====get all collection
router.get('/:id', (req, res) => {
    const CustumerId = req.params.id;
    Favorite.find({CustumerID:CustumerId})
        .then(favorites => {
            res.send(favorites)
        })
        .catch(err => console.log(err))
});





//  /api/favorite/isFav/costumerid <====get 200 if list exist
router.get('/isFav/:Cid/:Hid', async (req, res) => {
    const { Cid, Hid } = req.params;
    try{
      isFav= await Favorite.find({ CustumerID: Cid,
        HistoryID:Hid})      
      
    }catch(e){
        res.send(e);
    }

    if(isFav.length===0){
        res.send('false');
    }
    else{
        res.send('true');
    }
        
});


// /api/favorite/id <====delete list by list ID
router.delete('/:id', async (req, res) => {
    const favorite = req.params.id;
    try {
        await Favorite.findByIdAndDelete(favorite)
        res.status(200).send();
    } catch (e) {
        res.send(e);
    }


});




module.exports = router;