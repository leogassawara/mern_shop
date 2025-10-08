import Cart from '../model/cart.model.js';
import Product from '../model/product.model.js';
import User from '../model/user.model.js';


export const addToCart = async (req, res) => {
    try {
        
        // Encontrar o ID do produto
        const { productId } = req.body;

        if(!productId) {
            return res.status(400).json({ 
                message: "O ID do produto é obrigatório." 
            });
        }

        // Encontrar produto
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({ 
                message: "Produto não encontrado." 
            });
        }

        const userId = req.user._id;
        const cart = await User.findOne({ _id : userID }).select("cart");

        // TODO: Verificar se o produto já está no carrinho
        if(!cart) {
            const newCart = new Cart.create({
                user : userId,
                products : [product._id],
                /* $inc : { 
                    items : 1,
                    totalPrice : product.prices
                }*/
            });


            return res.status(201).json({ 
                message: "Produto adicionado ao carrinho.",
                cart: newCart 
            });
        }

        const updatedCart = await Cart.findOneAndUpdate({
            user : userId
        }, {
            $push : { 
                products : product._id
            }
        } , {
            new: true,
        });

        return res.status(200).json({ 
            message: "Produto adicionado ao carrinho.",
            cart: updatedCart 
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ 
            message: err.message || "Algum erro ocorreu ao adicionar item ao carrinho." 
        });
    }
};

export const getCart = async (req, res) => {
    try {
        // Encontrar o ID do usuário
        const userId = req.user._id;
        const cart = await Cart.findOne({ _id : userId }).select("cart");

        if(!cart) {
            return res.status(404).json({ 
                message: "Carrinho não encontrado." 
            });
        }

        return res.status(200).json({ 
            message: "Carrinho buscado com sucesso.",
            cart 
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Algum erro ocorreu."
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        // Encontrar o ID do produto
        const { productId } = req.body;

        if(!productId) {
            return res.status(400).json({ 
                message: "O ID do produto é obrigatório." 
            });
        }

        // Encontrar produto
        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({ 
                message: "Produto não encontrado." 
            });
        }

        const userId = req.user._id;
        const cart = await User.findOne({ _id : userID }).select("cart");

        if(!cart) {
            return res.status(404).json({ 
                message: "Carrinho não encontrado." 
            });
        }

        const updatedCart = await Cart.findOneAndUpdate({
            user : userId
        }, {
            $pull : { 
                product : product._id
            }
        } , {
            new: true,
        });

        return res.status(200).json({ 
            message: "Produto removido do carrinho.",
            cart: updatedCart 
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message || "Algum erro ocorreu."
        });
    }
};