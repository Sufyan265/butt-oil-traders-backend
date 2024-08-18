const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductSchema = new Schema({
    user: {
        // Ye syntax Model "user" ko Model "ProductModel" k sath link kry ga ("type:" me user id store ho jay gi) ↓ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    img: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    isBestSelling: {
        type: Boolean,
        default: false
    },
    isPopular: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', ProductSchema);
