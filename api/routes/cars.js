const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Car = require('../routes/models/car');
const User = require('../routes/models/user');

//Handle incoming Get request to /orders
router.get("/", (req,res,next) => {
    Car.find()
    .select('user _id cartype brand model year vin_number')
    .populate('user', '_id firstname lastname')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            cars: docs.map( doc => {
                return {
                    _id: doc._id,
                    user: doc.user,
                    cartype: doc.cartype,
                    brand: doc.brand,
                    model: doc.model,
                    year: doc.year,
                    vin_number: doc.vin_number,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/cars/' + doc._id
                    }
                }
            })
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});
//Handle incoming Post request to /orders
router.post('/', (req, res, next) => {
    User.findById(req.body.userID)
    .then(user => {
        if(!user)
        {
            return res.status(404).json({
                message: "User Not Found"
            });
        }
        const newcar = new Car({
            _id:  mongoose.Types.ObjectId(),
            cartype: req.body.cartype,
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            vin_number: req.body.vin_number,
            user: req.body.userID
        });

        return newcar
        .save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "car created",
            createdCar: {
                _id: result._id,
                user: result.user,
                cartype: result.cartype,
                brand: result.brand,
                model: result.model,
                year: result.year,
                vin_number: result.vin_number
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/cars/' + result._id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err,
            message: "i got an error while adding new car"
        });
    });

});

router.get('/:CarId' , (req, res, next) => {
    Car.findById(req.params.CarId)
    .populate('user', '_id firstname lastname')
    .exec()
    .then(car => {
        if(!car)
        {
            res.status(404).json({
              message: 'car Not Found'
            });
        }
        res.status(200).json({
            car: car,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/cars'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:CarId' , (req, res, next) => {
    Car.remove({_id: req.params.CarId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Car Deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/cars',
                body: {
                    cartype: "Car Type",
                    brand: "Brand",
                    model: "Model",
                    year: "Year",
                    vin_number: "Vin Number",
                    userID: "user id"
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});
module.exports= router;
