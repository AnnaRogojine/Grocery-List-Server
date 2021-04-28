const express = require('express');
const app = express();
const mongoose = require('mongoose'); // use mongoose to connect to DB
require('dotenv').config();

app.use(express.json());
//middleware:
const authRoutes = require('./routes/auth');
const verifyToken = require('./routes/verifyToken');
const houses = require('./routes/houses');
const maps = require('./routes/Maps');
const OldList = require('./routes/OldList');
const listItem = require('./routes/list');
const Favorite = require('./routes/favorite');


mongoose.connect('mongodb+srv://AnnaRo:Df2MqKasP3ii05Mz@cluster0.ymfp4.mongodb.net/auth_system?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        //connect web:
        

        const port = process.env.PORT || 3000; // if we dont have port in env file use port=3000
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`);
        })

    })
    .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('welcome to home route');
});

// cant access this route without being authenticated
app.get('/api/user/profile', verifyToken , (req, res) => {
    console.log(req.user);
    res.send({success: true , data: req.user});
});

//middleware:
app.use('/api/users', authRoutes);
app.use('/api/houses',houses);
app.use('/api/maps',maps);
app.use('/api/list', listItem);
app.use('/api/OldList',OldList);
app.use('/api/favorite', Favorite);

// DB_USERNAME ='limorsh'
// DB_PASSWORD='limorsagi123'
//mongoose.connect('mongodb+srv://limorsh:limorsagi123@cluster0.ymfp4.mongodb.net/auth_system?retryWrites=true&w=majority',
//require('dotenv').config();
//mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ymfp4.mongodb.net/auth_system?retryWrites=true&w=majority`,


