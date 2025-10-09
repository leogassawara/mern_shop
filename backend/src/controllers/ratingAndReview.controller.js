import Product from "../models/product.model.js";
import RatingAndReview from "../models/ratingAndReview.model.js";

// Create a new rating and review
export const createRatingAndReview = async (req, res) => {
    try {
        
        const userId = req.user._id;
        const productId = req.body.productId;
        const rating = req.body.rating;
        const review = req.body.review;

        if(!productId){
            return res.status(400).json({ 
                message: "Product ID is required." 
            });
        }

        if(!rating && !review){
            return res.status(400).json({ 
                message: "Rating or review is required." 
            });
        };

        /*const user = await user.findById(userId);
        if(!user){
            return res.status(404).json({ 
                message: "User not found." 
            });
        }*/

        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({ 
                message: "Product not found." 
            });
        }

        const newRatingAndReview = new RatingAndReview.create({
            user: userId,
            product: productId,
            rating: rating,
            review: review
        });

        res.status(201).json({ 
            message: "Rating and review created successfully.", 
            ratingAndReview: newRatingAndReview 
        });
    }
    catch (err) {
        res.status(500).json({ 
            message: "Internal server error." 
        });
    }
}

// Get all ratings and reviews for a product

export const getAllRatingsAndReviews = async (req, res) => {
    try {
        const allRatingsAndReviews = await RatingAndReview.find().populate('product').populate('user');

        if(!allRatingsAndReviews){
            return res.status(404).json({ 
                message: "No ratings and reviews found." 
            });
        }

        res.status(200).json({ 
            message: "Ratings and reviews fetched successfully.", 
            ratingsAndReviews: allRatingsAndReviews 
        });
    }
    catch (err) {
        res.status(500).json({ 
            message: "Internal server error." 
        });
    }
}