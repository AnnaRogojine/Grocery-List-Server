const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const axios = require('axios');

const fs = require('fs');

require('dotenv').config();

//define validation for product inputs
const validateProduct = [
    check('productName').isLength({ min: 2 }).withMessage('Product name inValid. Must contain atleast 2 characters'),
]

router.post('/findItemByName', validateProduct, async (req, res) => {

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

module.exports = router;