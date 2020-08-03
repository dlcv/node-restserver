const _ = require('underscore');
const express = require('express');

const { verify, verifyAdmin } = require('../middlewares/auth');

let app = express();

let Product = require('../models/product');

// List all products
app.get('/producto', verify, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 5;
    let condition = { status: true };
    Product.find(condition, 'name price description image status category')
        .skip(from)
        .limit(limit)
        .sort('name')
        .populate('category', 'name')
        .populate('user', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Product.countDocuments(condition, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    products
                });
            });
        });
});

// List one product
app.get('/producto/:id', (req, res) => {
    let id = req.params.id;
    Product.findById(id, 'name price description image status category')
        .populate('category', 'name')
        .populate('user', 'name')
        .exec((err, product) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!product) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID del producto no fue encontrado'
                    }
                });
            }
            res.json({
                ok: true,
                product
            });
        });
});

// Search a product
app.get('/producto/buscar/:query', verify, (req, res) => {
    let regex = new RegExp(req.params.query, 'i');
    let condition = { name: regex };
    Product.find(condition, 'name price description image status category')
        .sort('name')
        .populate('category', 'name')
        .populate('user', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Product.countDocuments(condition, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    products
                });
            });
        });
});

// Create one product
app.post('/producto', [verify, verifyAdmin], (req, res) => {
    let product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        category: req.body.category,
        user: req.user._id
    });
    product.save((err, productdb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productdb) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            product: productdb
        });
    });
});

// Update one product
app.put('/producto/:id', [verify, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let edited = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        status: req.body.status,
        category: req.body.category,
        user: req.user._id
    }
    Product.findByIdAndUpdate(id, edited, { new: true, runValidators: true, context: 'query' }, (err, productdb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productdb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del producto no fue encontrado'
                }
            });
        }
        res.json({
            ok: true,
            product: productdb
        });
    });
});

// Delete one category (logical delete)
app.delete('/producto/:id', [verify, verifyAdmin], function(req, res) {
    let id = req.params.id;
    let deleted = {
        status: false
    }
    Product.findByIdAndUpdate(id, deleted, { new: true, runValidators: true, context: 'query' }, (err, productdb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productdb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID del producto no fue encontrado'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Producto eliminado'
        })
    })
});

module.exports = app;