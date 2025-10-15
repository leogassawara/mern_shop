import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    products : [
        {
            product : {type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity : {type: Number, default : 1},
            price : {type: Number}
        }
    ],

    totalPrice : {
        type: Number
    },

    status : {
        type: String,
        enum: ['Pending', 'Delivered', 'Cancelled', "Shipped"],
        default: 'Pending'
    }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;