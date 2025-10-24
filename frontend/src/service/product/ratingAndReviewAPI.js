import { APIConnector } from "../apiConnector";


export const submitRatingAndReview = async (data, token) => {
    const response = await APIConnector({
        method: 'POST',
        url: 'ratingAndReview',
        data,
        token
    });

    return response.data;
}

export const getAllRatingsAndReviews = async (token) => {
    const response = await APIConnector({
        method: 'GET',
        url: 'ratingAndReview',
        token
    });

    return response.data;
}