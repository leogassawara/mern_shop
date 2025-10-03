import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name : { 
        type: String, 
        required: true 
    },

    description : { 
        type: String 
    },  

    price : { 
        type: Array, 
        required: true 
    },

    imageUrl : { 
        type: String,
        required: true
    },

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

    seller : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
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

export default mongoose.model('Product', productSchema);