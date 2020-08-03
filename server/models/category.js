const mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre de la categoría es requerido']
    },
    description: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

categorySchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

module.exports = mongoose.model('Category', categorySchema);