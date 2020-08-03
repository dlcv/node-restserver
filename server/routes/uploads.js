const fs = require('fs');
const path = require('path');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const User = require('../models/user');
const Product = require('../models/product');

// Default options
app.use(fileUpload());

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    let validTypes = ['productos', 'usuarios'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + validTypes.join(', ')
            }
        })
    }

    let uploadedFile = req.files.uploadedFile;
    let fileData = uploadedFile.name.split('.');
    let fileExtension = fileData[fileData.length - 1];

    // Allowed extensions
    let allowed = ['png', 'jpg', 'jpeg', 'gif'];

    if (allowed.indexOf(fileExtension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + allowed.join(', '),
                extension: fileExtension
            }
        })
    }

    // Change file name
    let fileName = `${id}-${new Date().getMilliseconds()}.${fileExtension}`;

    switch (type) {
        case 'productos':
            type = 'products'
            break;
        case 'usuarios':
            type = 'users'
            break;
        default:
            break;
    }

    uploadedFile.mv(`uploads/${type}/${fileName}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        switch (type) {
            case 'users':
                userImage(id, res, fileName);
                break;
            case 'products':
                productImage(id, res, fileName);
                break;
            default:
                break;
        }
    });
});

function userImage(id, res, fileName) {
    User.findById(id, (err, userdb) => {
        if (err) {
            deleteImage(fileName, 'users');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!userdb) {
            deleteImage(fileName, 'users');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El usuario no existe'
                }
            });
        }
        deleteImage(userdb.image, 'users');
        userdb.image = fileName;
        userdb.save((err, saved) => {
            res.json({
                ok: true,
                user: saved,
                image: fileName
            })
        });
    });
}

function productImage(id, res, fileName) {
    Product.findById(id, (err, productdb) => {
        if (err) {
            deleteImage(fileName, 'products');
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productdb) {
            deleteImage(fileName, 'products');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }
        deleteImage(productdb.image, 'products');
        productdb.image = fileName;
        productdb.save((err, saved) => {
            res.json({
                ok: true,
                product: saved,
                image: fileName
            })
        });
    });
}

function deleteImage(imageName, imageType) {
    let pathImage = path.resolve(__dirname, `../../uploads/${imageType}/${imageName}`);
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;