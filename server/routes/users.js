const express = require('express');
const app = express();

const User = require('../models/user');
const { verify, verifyAdmin } = require('../middlewares/auth');

const bcrypt = require('bcrypt');

const _ = require('underscore');

app.get('/usuario', verify, (req, res) => {
    let from = Number(req.query.from) || 0;
    let limit = Number(req.query.limit) || 5;
    let condition = { status: true };
    User.find(condition, 'name email status role google')
        .skip(from)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            User.countDocuments(condition, (err, count) => {
                res.json({
                    ok: true,
                    count,
                    users
                });
            });
        });
});

app.post('/usuario', [verify, verifyAdmin], (req, res) => {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userdb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        // userdb.password = null

        res.json({
            ok: true,
            user: userdb
        });
    });
});

app.put('/usuario/:id', [verify, verifyAdmin], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'password', 'email', 'img', 'role', 'status']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userdb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userdb
        });
    })
});

app.delete('/usuario/:id', [verify, verifyAdmin], function(req, res) {
    let id = req.params.id;
    User.findByIdAndUpdate(id, { status: false }, { new: true }, (err, deleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!deleted) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }
        res.json({
            ok: true,
            deleted
        })
    })
});

module.exports = app;