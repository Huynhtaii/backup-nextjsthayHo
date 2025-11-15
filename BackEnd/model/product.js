const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema({
    id: ObjectId,
    name: { type: String, required: true },
    img_url: { type: String, default: '' },
    price: { type: Number, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: '' },
    category_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Category',
        required: true 
    },
    brand: { type: String, default: '' },
    variants: [{
        size: { type: String },
        color: { type: String },
        quantity: { type: Number, default: 0 }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);