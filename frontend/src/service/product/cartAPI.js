import { APIConnector } from "../apiConnector";

export const addToCart = async (data, token) => {
    const response = await APIConnector({
        method: 'POST',
        url: 'cart/add',
        data,
        token
    });

    return response.data;
}

export const getCart = async (token) => {
    const response = await APIConnector({
        method: 'GET',
        url: 'cart',
        token
    });

    return response.data;
}

export const removeFromCart = async (data, token) => {
    const response = await APIConnector({
        method: 'DELETE',
        url: 'cart/remove',
        data,
        token
    });

    return response.data;
}
