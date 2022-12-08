const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../routes/models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' +doc._id
                    }
                }
            })
        };
        // if(docs.length >=0)
        // {
            res.status(200).json(response);
        // }
        // else
        // {
        //     res.status(404).json({
        //         message: "no entry found"
        //     });
        // }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {

    const product =new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Product Created Successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'+ result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });

});

router.get('/:ProductId' , (req, res, next) => {
        const product_id = req.params.ProductId;

        Product.findById(product_id)
        .select('name price _id')
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc)
            {
                res.status(200).json({
                    product: doc,
                    response: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            }
            else
            {
                res.status(404).json({
                    message: "No record Found"
                });
            }

        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.patch('/:ProductId' , (req , res , next) => {
    const id= req.params.ProductId;
    var updateOps ={};

    for(const ops of req.body)
    {
        updateOps=[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, { $set: {updateOps}})
    .exec()
    .then( result => {
        console.log(result);
        res.status(200).json({
            message: "product updated successfully",
            response: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:ProductId' , (req, res, next) => {
    const id = req.params.ProductId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json({
            message: "Product deleted",
            response: {
                type: 'POST',
                url: 'http://localhost:3000/products',
                body: {name: 'String', price: 'Number'}
            }
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
