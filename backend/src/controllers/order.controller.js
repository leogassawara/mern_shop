import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Admin from "../models/admin.model.js";

// Create a new order
export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const productId = req.body.products;

        if(!products){
            return res.status(400).json({ 
                message: "Products are required to place an order." 
            });
        }

        const user = await User.findById(userId);

        if(!user){
            return res.status(404).json({ 
                message: "User not found." 
            });
        }

        const newOrder = new Order.create({
            user: userId,
            products: products,
            totalPrice : products.reduce((acc, curr) => acc + curr.price, 0),
            status: 'Pending'
        });

        res.status(201).json({ 
            message: "Order created successfully.", 
            order: newOrder 
        });
    }
    catch (err) {
        res.status(500).json({ 
            message: "Internal server error." 
        });
    }
}

// Get all orders for a user
export const getAllOrders = async (req, res) => {
    try {
        const allOrders = await Order.find().populate('user').populate('products');

        if(!allOrders){
            return res.status(404).json({ 
                message: "No orders found." 
            });
        }

        return res.status(200).json({ 
            message: "Orders fetched successfully.", 
            orders: allOrders 
        });
    }
    catch (err) {
        res.status(500).json({ 
            message: "Internal server error." 
        });
    }
}


// Get a single order
export const getSingleOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        if(!orderId){
            return res.status(400).json({ 
                message: "Order ID is required." 
            });
        }

        const order = await Order.findById(orderId).populate('user').populate('products');

        if(!order){
            return res.status(404).json({ 
                message: "Order not found." 
            });
        }

        return res.status(200).json({ 
            message: "Order fetched successfully.", 
            order: order 
        });
    }
    catch (err) {
        res.status(500).json({ 
            message: "Internal server error." 
        });
    }
}

// Update an order
export const updateOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const status = req.body.status;

        if(!orderId){
            return res.status(400).json({ 
                message: "Order ID is required." 
            });
        }

        if(!status){
            return res.status(400).json({ 
                message: "Status is required." 
            });
        }

        /*const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({ 
                message: "Order not found." 
            });
        }*/

        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            status: status
        });

        if(!updatedOrder){
            return res.status(400).json({ 
                message: "Order not updated." 
            });
        }

        return res.status(200).json({ 
            message: "Order updated successfully.", 
            order: updatedOrder 
        });
    }
    catch (err) {
        res.status(500).json({ 
            message: "Internal server error." 
        });
    }
}

// Cancel an order
export const cancelOrder = async (req, res) => {
    try {
        const orderId = req.params.id;

        if(!orderId){
            return res.status(400).json({ 
                message: "Order ID is required." 
            });
        }

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({ 
                message: "Order not found." 
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            status: 'Cancelled'
        });

        if(!updatedOrder){
            return res.status(400).json({ 
                message: "Order not cancelled." 
            });
        }

        return res.status(200).json({ 
            message: "Order cancelled successfully.", 
            order: updatedOrder 
        });
    }
    catch (err) {
        res.status(500).json({ 
            message: "Internal server error." 
        });
    }
}

// Deliver an order


// Delete an order