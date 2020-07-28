const express = require('express');
const app = express();

const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

app.post('/login', (req, res) => {
    let body = req.body;
    User.findOne({ email: body.email }, (err, userdb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userdb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario o contraseña son incorrectos'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, userdb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario o contraseña son incorrectos'
                }
            });
        }

        let token = jwt.sign({
            user: userdb,
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        res.json({
            ok: true,
            user: userdb,
            token
        });
    });
});

module.exports = app;