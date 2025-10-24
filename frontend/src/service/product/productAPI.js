import { APIConnector } from "../apiConnector";

export const createProduct = async (data, token) => {
    const response = await APIConnector({
        method: 'POST',
        url: 'product',
        data,
        token
    });

    return response.data;
}

export const updateProduct = async (id, data, token) => {
    const response = await APIConnector({
        method: 'PUT',
        url: `product/${id}`,
        data,
        token
    });

    return response.data;
}

export const deleteProduct = async (id, token) => {
    const response = await APIConnector({
        method: 'DELETE',
        url: `product/${id}`,
        token
    });

    return response.data;
}

export const getProductById = async (id) => {
    const response = await APIConnector({
        method: 'GET',
        url: `product/${id}`,
    });

    return response.data;
}

export const getProducts = async () => {
    const response = await APIConnector({
        method: 'GET',
        url: 'product',
    });

    return response.data;
}