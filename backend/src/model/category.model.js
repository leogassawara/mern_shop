import mongoose from "mongoose";
import adminModel from "./admin.model";

const CategorySchema = new mongoose.Schema({
    categoryName : { 
        type: String, 
        required: true
    },

    admin : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    }
}, {
    timestamps: true
});

export default mongoose.model('Category', CategorySchema);