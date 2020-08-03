const fs = require('fs');
const path = require('path');
const express = require('express');
const { verifyTokenImage } = require('../middlewares/auth');

let app = express();

app.get('/imagen/:type/:image', verifyTokenImage, (req, res) => {
    let type = req.params.type;
    let image = req.params.image;
    switch (type) {
        case 'usuarios':
            type = 'users';
            break;
        case 'productos':
            type = 'products';
            break;
        default:
            break;
    }
    let pathImage = path.resolve(__dirname, `../../uploads/${type}/${image}`);
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
})

module.exports = app;