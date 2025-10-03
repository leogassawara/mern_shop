import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },

    email: { 
        type: String, 
        required: true, 
        unique: true 
    },

    role: { 
        type: String, 
        required: true,
        enum: ['Seller', 'Buyer', 'Admin']
    },

    cart : [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Cart'
        }
    ],

    orders : [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Order'
        }
    ],

    address : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address'
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'  
        }
    ],

    password: { 
        type: String, 
        required: true 
    },
}, 
{ 
    timestamps: true 
});

export default mongoose.model('User', adminSchema);