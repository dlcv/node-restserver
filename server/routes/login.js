const express = require('express');
const app = express();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const user = require('../models/user');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Google config
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        image: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(e => {
        res.status(403).json({
            ok: false,
            err: e
        })
    });

    User.findOne({ email: googleUser.email }, (err, userdb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (userdb) {
            if (userdb.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar su autenticación normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userdb,
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                return res.json({
                    ok: true,
                    user: userdb,
                    token
                });
            }
        } else {
            // User doesn't exist
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.image = googleUser.image;
            user.google = true;
            user.password = ':)';
            user.save((err, userdb) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                let token = jwt.sign({
                    user: userdb,
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

                return res.json({
                    ok: true,
                    user: userdb,
                    token
                });
            });
        }

    })
});

module.exports = app;