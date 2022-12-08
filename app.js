const express = require('express');
const app = express();
const morgan = require('morgan');

require('dotenv').config();
const mongoose = require('mongoose');

const products = require('./api/routes/products');
const orders = require('./api/routes/orders');
const users = require('./api/routes/user');
const mechanics = require('./api/routes/mechanic');
const cars = require('./api/routes/cars');

mongoose.connect('mongodb+srv://baaztech:'+ process.env.MONGO_ATLAS_PW +'@mechtrip.6akea.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    // useMongoClient: true
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-Width, Content-Type, Accept, Authorization');
    if(req.method ==='OPTIONS')
    {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

//Routes which should handle requests
app.use('/products', products);
app.use('/orders', orders);
app.use('/user', users);
app.use('/mechanic', mechanics);
app.use('/cars', cars);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});
module.exports = app;