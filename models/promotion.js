const mongoose = require('mongoose')
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const Schema = mongoose.Schema;

const promotionSchema = new Schema({
    name : {
        type: String,
        required: true,
        unique: true
    },
    image : {
        type: String,
        required: true
    },
    label : {
        type: String,
        default: ""
    },
    price : {
        type: Currency,
        min: 0,
        required: true
    },
    featured : {
        type: Boolean,
        required: true
    },
    description : {
        type: String,
        required: true
    },
})
var Promotions = mongoose.model('promotion', promotionSchema)
module.exports = Promotions