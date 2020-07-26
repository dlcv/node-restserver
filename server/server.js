require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

app.use(require('./routes/routes'));

mongoose.connect(process.env.URLDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((resp) => {
        console.log('Conectado');
    })
    .catch((error) => {
        console.log('Error en conexión a MongoDB', error);
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});