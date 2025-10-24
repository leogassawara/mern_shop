import { APIConnector } from "../apiConnector";

export const createOrder = async (data, token) => {
    const response = await APIConnector({
        method: 'POST',
        url: 'orders',
        data,
        token
    });

    return response.data;
}

export const getAllOrders = async (token) => {
    const response = await APIConnector({
        method: 'GET',
        url: 'orders',
        token
    });

    return response.data;
}

export const getSingleOrder = async (id, token) => {
    const response = await APIConnector({
        method: 'GET',
        url: `orders/${id}`,
        token
    });

    return response.data;
}

export const updateOrder = async (id, data, token) => {
    const response = await APIConnector({
        method: 'PUT',
        url: `orders/${id}`,
        data,
        token
    });

    return response.data;
}

export const cancelOrder = async (id, token) => {
    const response = await APIConnector({
        method: 'DELETE',
        url: `orders/${id}/cancel`,
        token
    });

    return response.data;
}

export const deleteOrder = async (id, token) => {
    const response = await APIConnector({
        method: 'DELETE',
        url: `orders/${id}`,
        token
    });

    return response.data;
}