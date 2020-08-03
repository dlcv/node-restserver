var mongoose = require('mongoose');

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var productSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: [true, 'El nombre de producto es requerido']
    },
    price: {
        type: Number,
        required: [true, 'El precio del producto es requerido']
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    image: {
        type: String,
        required: false
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

productSchema.plugin(uniqueValidator, {
    message: '{PATH} debe ser único'
});

module.exports = mongoose.model('Product', productSchema);