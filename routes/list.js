const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const axios = require('axios');

const fs = require('fs');

require('dotenv').config();

//const data = "action=GetProductsByName&product_name[]=ביסלי&limit=2&api_key=a9a90c30415df0e3e749467e5334e70eb566407b";
//const data = "action=GetProductsByName&product_name[]=במבה)&limit=2&api_key=a9a90c30415df0e3e749467e5334e70eb566407b";

//define validation for product inputs
const validateProduct = [
    check('productName').isLength({ min: 2 }).withMessage('Product name inValid. Must contain atleast 2 characters'),
]

router.post('/findItemByName', validateProduct, async (req, res) => {
    //const data = "action=GetProductsByName&product_name[]=יסלי)&limit=3&api_key=a9a90c30415df0e3e749467e5334e70eb566407b";
    // const productName = 'ביסלי';

    // validate data against validation rules in "validateProduct"
    const errors = validationResult(req);

    if (!errors.isEmpty()) { //if we have an input error
        return res.status(400).json({ errors: errors.array() });

    } else {
        //extract product name from req.body
        const productName = req.body.productName;
        //console.log(productName);

        //http call to get all products info'
        const results = await axios.post('https://api.superget.co.il/', `action=GetProductsByName&product_name[]=${productName}&limit=50&api_key=9eed50fb6a59631980db20579f7e840cfca426b1`,
            {
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                    "charset": "utf-8"
                }
            })
            .then((productData) => {

                productData.data.map(result => ({
                        manufacturer_id:manufacturer_id,
                        product_name:product_name,
                        product_description: product_description,
                        product_barcode:product_barcode,
                        product_quantity:1,
                        manufacturer_name:manufacturer_name}))
                fs.writeFile('./test.txt', JSON.stringify(productData.data), function (err) {
                    if (err) return console.log(err);
                    console.log('Data in file!');

                }); 
                console.log('data', productData.data);
                const Pdata = JSON.stringify(productData.data);
                if (!Pdata) return res.status(404).send({ success: false, message: 'No Data' });

                // attaching the data to the header of our response:
                res.send({ success: true, message: 'Fetch Data Succesfully', Pdata })
            })
            .catch((err) => {
                console.log('error', err)
            })
    }
});

module.exports = router;