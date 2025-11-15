const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    description: { 
        type: String, 
        default: '' 
    },
    img_url: {              // ← THÊM FIELD NÀY
        type: String,
        default: ''
    },
    parentId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Category',
        default: null 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Category', CategorySchema);