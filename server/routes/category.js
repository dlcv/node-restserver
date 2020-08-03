const _ = require('underscore');
const express = require('express');

const { verify, verifyAdmin } = require('../middlewares/auth');

let app = express();

let Category = require('../models/category');

// List all categories
app.get('/categoria', verify, (req, res) => {
    Category.find({}, 'name description user')
        .sort('name')
        .populate('user', 'name email role')
        .exec((err, categories) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Category.countDocuments({}, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    categories
                });
            });
        });
});

// List one category
app.get('/categoria/:id', (req, res) => {
    let id = req.params.id;
    Category.findById(id, 'name description user').exec((err, category) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!category) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID de la categoría no fue encontrado'
                }
            });
        }
        res.json({
            ok: true,
            category
        });
    });
});

// Create one category
app.post('/categoria', [verify, verifyAdmin], (req, res) => {
    let body = req.body;
    let category = new Category({
        name: body.name,
        description: body.description,
        user: req.user._id
    });
    category.save((err, categorydb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categorydb) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categorydb
        });
    });
});

// Update one category
app.put('/categoria/:id', [verify, verifyAdmin], (req, res) => {
    let id = req.params.id;
    let edited = {
        name: req.body.name,
        description: req.body.description,
        user: req.user._id
    }
    Category.findByIdAndUpdate(id, edited, { new: true, runValidators: true, context: 'query' }, (err, categorydb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categorydb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID de la categoría no fue encontrado'
                }
            });
        }
        res.json({
            ok: true,
            category: categorydb
        });
    });
});

// Delete one category (phisical delete)
app.delete('/categoria/:id', [verify, verifyAdmin], function(req, res) {
    let id = req.params.id;
    Category.findByIdAndRemove(id, (err, deleted) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!deleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID de la categoría no fue encontrado'
                }
            });
        }
        res.json({
            ok: true,
            message: 'Categoría eliminada'
        })
    })
});

module.exports = app;