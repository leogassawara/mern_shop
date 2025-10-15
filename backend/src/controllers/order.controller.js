import Product from "../model/product.model.js";
import User from "../model/user.model.js";
import Order from "../model/order.model.js";


// Create a new order
export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const products = req.body.products;

        if(!products || products.length === 0){
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

        let totalPrice = 0;
        const productDetails = [];

        for (const item of products){
            const product = await Product.findById(item.productId);
            if(!product){
                return res.status(404).json({
                    message : 'Product with ID ${item.productId} not found'
                });
            }

            const quantity = item.quantity || 1;
            const price = product.prices * quantity;
            totalPrice += price;

            productDetails.push({
                product: product._id,
                quantity,
                price
            });
        }

        const newOrder = await Order.create({
            user: userId,
            products: productDetails,
            totalPrice,
            status: 'Pending'
        });

        await User.findByIdAndUpdate(userId, {$unset : { cart: ""}});

        await User.findByIdAndUpdate(userId,{
            $push : { orders : newOrder._id}
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

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(404).json({ 
                message: "Order not found." 
            });
        }

        if(order.status === "Cancelled"){
            return res.status(400).json({
                message : "Order is Cancelled"
            })
        }

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

        if(order.status === "Shipped"){
            return res.status(400).json({
                message : "Order is shipped, Your are not allowed to cancel it"
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            status: 'Cancelled'
        });

        if(!updatedOrder){
            return res.status(400).json({ 
                message: "Order not updated." 
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

export const deleteOrder = async (req, res) => {
    try{
        const orderId = req.params.id;

        if(!orderId){
            return res.status(400).json({
                message : "Please provide an order id"
            });
        }

        const order = await Order.findById(orderId);

        if(!order){
            return res.status(400).json({
                message : "Order not found"
            });
        }

        if(order.status === "Cancelled" || order.status === "Delivered"){
            await Order.findByIdAndDelete(orderId);

            await User.findByIdAndUpdate(order.user, {
                $pull : {
                    orders : orderId
                }
            });
        }

        if(order.status === "Shipped" || order.status === "Pending"){
            return res.status(400).json({
                message : "Order is shipped, You are not allowed to delete it"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message : "Internal server error"
        });
    }
}