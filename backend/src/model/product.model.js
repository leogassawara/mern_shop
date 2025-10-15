import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : { 
        type: String, 
        required: true 
    },

    description : { 
        type: String 
    },  

    prices : { 
        type: Array, 
        required: true 
    },

    imageUrl : [{ 
        type: String,
        required: true
    }],

    ratingAndReview : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RatingAndReview'
        }
    ],

    category : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },

    /* seller : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, */

    user : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    stock : { 
        type: Number,
        required: true
    },

    discount : { 
        type: Number,
        default: 0
    },
    
    salesCount : { 
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema);
export default Product;