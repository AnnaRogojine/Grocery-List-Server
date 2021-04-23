const router = require('express').Router();
const axios = require('axios');


const DEFAULT_PHOTO_URL = 'https://image.freepik.com/free-vector/supermarket-icon_24911-7803.jpg';

router.get('/supermarkets', async (req, res) => {
    try{
    const { lat, long } = req.query;
    console.log(lat, long)
    const {results} = (await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`,
        { params: { location: `${lat},${long}`, radius: 1500, type: 'supermarket', key: process.env.GOOGLE_API_KEY } })).data;
    
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
    res.send(places.slice(0,10))
} catch(e){
    console.log(e)
}
})

module.exports = router;