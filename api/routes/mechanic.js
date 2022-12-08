const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');

const Mechanic = require('../routes/models/mechanic');
const mechanic = require('../routes/models/mechanic');

router.post('/signup', (req, res, next) => {

    //Check email availability
    Mechanic.find({email: req.body.email})
    .exec()
    .then( mechanic => {
        if(mechanic.length >= 1)
        {
            return res.status(409).json({
                message: "Mail already exists"
            });
        }
        else
        {
            bcrypt.hash(req.body.password, 10 , (err , hash) => {
                if(err)
                {
                    return res.status(500).json({
                        error: err
                    });
                }
                else
                {
                    const mechanic = new Mechanic({
                        _id: new mongoose.Types.ObjectId(),
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        phonenumber: req.body.phonenumber,
                        lat: req.body.lat,
                        long: req.body.long,
                        password: hash
                    });

                    mechanic
                    .save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "User Added"
                        });
                    })
                    .catch( err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                }
            });
        }
    });


});

router.post('/login', (req, res, next) => {
    Mechanic.find({email: req.body.email})
    .exec()
    .then(mechanic => {
        if(mechanic.length < 1)
        {
            return res.status(401).json({
                Message: "Auth Failed"
            });
        }
        bcrypt.compare(req.body.password, mechanic[0].password, (err , result) => {
            if(err)
            {
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }
            if(result)
            {
                const token = jwt.sign({
                    email: mechanic[0].email,
                    userId: mechanic[0]._id
                }, process.env.JWT_KEY,
                {
                    expiresIn: "1h"
                }
                );
                return res.status(200).json({
                    message: "Auth Successful",
                    token: token
                });
            }
            res.status(401).json({
                message: "Auth Failed"
            });
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:mechID', (req, res, next) => {
    Mechanic.remove({id: req.params.mechId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "User Deleted Successfully"
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
module.exports= router;
