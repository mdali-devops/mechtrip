const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../routes/models/order');
const Product = require('../routes/models/product');

//Handle incoming Get request to /orders
router.get("/", (req,res,next) => {
    Order
    .find()
    .select('_id quantity product')
    .populate('product', '_id name price')
    .exec()
    .then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })

        });
    })
    .catch(err => {
        res.status(500).json(err);
    });
});
//Handle incoming Post request to /orders
router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if(!product)
        {
            return res.status(404).json({
                message: 'Product Not Found'
            });
        }
        const order = new Order({
            _id:  mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId
        });

        return order
        .save();
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: "Order Stored",
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'+ result._id
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

router.get('/:OrderId' , (req, res, next) => {
    Order.findById(req.params.OrderId)
    .populate('product', '_id name price')
    .exec()
    .then(order => {
        if(!order)
        {
            res.status(404).json({
              message: 'Order Not Found'
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/orders'
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:OrderId' , (req, res, next) => {
    Order.remove({_id: req.params.OrderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Order Deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: {
                    productId: "ID",
                    quantity: "Number"
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
