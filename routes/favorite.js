const express = require('express');
const { check, validationResult } = require('express-validator');

const Favorite = require('../models/Favorite');
const OldList = require('../models/OldList');
const { route } = require('./list');

const router = express.Router();

const validate = [
    check('CustumerID').notEmpty().withMessage('No Cid provided'),

    // check('HistoryID').exists(),
    // check('HistoryID').notEmpty().withMessage('No Hid provided'),


]

// /api/favorite/addFav/:CostumerID/:Historylistid   <==save the list in the history
router.post('/addFav/:Cid/:Hid', async (req, res) => {
    const { Cid, Hid } = req.params;
    
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).send({ errors: errors.array() })
    }

    await Favorite.findOneAndUpdate({CustumerID: Cid}, {$push: {FavoriteListIds: Hid}}, {upsert: true});

    res.sendStatus(200);

})
//  /api/favorite/costumerId  <====get all my collection
router.get('/:id', async (req, res) => {
    const CustumerId = req.params.id;
    const userFavorites = await Favorite.findOne({CustumerID:CustumerId})
    res.send(userFavorites.FavoriteListIds);
});



// /api/favorite/delete/:Cid/:Hidid <====delete from favorite list where costumerid=cid and Historyid=Hid
router.delete('/delete/:Cid/:Hid', async (req, res) => {
    const { Cid, Hid } = req.params;
    try {
        await Favorite.findOneAndUpdate({CustumerID:Cid}, {$pull: {FavoriteListIds: Hid}})
        res.status(200).send();
    } catch (e) {
        res.send(e);
    }


});




module.exports = router;