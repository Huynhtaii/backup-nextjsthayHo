const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const brandSchema = new Schema({
    id: ObjectId,
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);




