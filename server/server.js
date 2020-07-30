require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse application/json
app.use(express.json());

// Routes
app.use(require('./routes/index'));

// Public folder
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((resp) => {
        console.log('Conectado a la base de datos');
    })
    .catch((error) => {
        console.log('Error en conexión a MongoDB', error);
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});