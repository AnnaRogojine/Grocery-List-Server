const router = require('express').Router();
const axios = require('axios');


const DEFAULT_PHOTO_URL = 'https://image.freepik.com/free-vector/supermarket-icon_24911-7803.jpg';
//  /api/maps/supermarkets
router.get('/supermarkets', async (req, res) => {
    try{
    const { lat, long,radius} = req.query;
   
    const {results} = (await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        { params: { location: `${lat},${long}`, radius: `${radius}`, type: 'supermarket', key: process.env.GOOGLE_API_KEY } })).data;
    const places = results.map(result => ({
        coordinate: {
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng
        },
        placeTypes: result.types,
        placeId: result.place_id,
        placeName: result.name,
        uri: result.photos ? `https://maps.googleapis.com/maps/api/place/photo?photoreference=${result.photos[0].photo_reference}&sensor=false&maxheight=200&maxwidth=200&key=${process.env.GOOGLE_API_KEY}` : DEFAULT_PHOTO_URL,
        isOpen: result.opening_hours && result.opening_hours.open_now,
        placeAddress: result.vicinity
    }))
    //res.send(places);
    res.send(places.slice(0,30))
} catch(e){
    console.log(e)
}
})
// /api/maps/supergetmarkets 
router.get('/supergetmarkets',async (req, res)=>{
    
    const {lat,long,radius} = req.query;
    
    try{
        
        const result = await axios.post('https://api.superget.co.il/', 
        `action=GetStoresByGPS&latitude=${lat}&longitude=${long}&km_radius=${radius}&limit=2&api_key=${process.env.SUPERGET_KEY2}`)
       
       
        res.send(result.data);
    } catch (e){
        res.send(e);
    }
})// /api/maps/getPrice/supergetmarkets <===get all products of specific store
router.get('/getPrice/supergetmarkets',async (req, res)=>{
    
    const {store_id, product_barcode} = req.query;
    console.log(store_id, product_barcode);
    try{
        
        const result = await axios.post('https://api.superget.co.il/', 
        `action=GetPriceByProductBarCode&store_id=${store_id}&product_barcode=${product_barcode}&api_key=${process.env.SUPERGET_KEY2}`)
        const {data} = result;

        if(data.error_type){
            return res.sendStatus(404);
        }

        res.send(data);
       
    } catch (e){
        res.send(e);
    }
})
module.exports = router;