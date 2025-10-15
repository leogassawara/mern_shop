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

        const userId = req.user.id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message : "User not found"
            });
        }

        const cart = await Cart.findOne({ user : userId });

        // TODO: Verificar se o produto já está no carrinho
        if(!cart) {
            const newCart = await Cart.create({
                user : userId,
                products : [
                    {
                        productId : product._id,
                        name : product.name,
                        price : Number(product.prices),
                        image : Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl,
                        quantity : 1
                    },
                ],
                totalPrice : Number(product.prices)
            });

            await User.findByIdAndUpdate(user._id, {
                $set : {
                    cart : newCart._id
                }
            });

            return res.status(201).json({ 
                message: "Produto adicionado ao carrinho.",
                cart: newCart 
            });
        }

        const existingProduct = cart.products.find(product => product.productId.toString() === productId);
        
        if(existingProduct){
            existingProduct.quantity += 1;
        }
        else{
            cart.products.push({
                productId : product._id,
                name : product.name,
                price : Number(product.prices),
                image : Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl,
                quantity : 1
            });
        }

        cart.totalPrice += Number(product.prices);
        await cart.save()

        await User.findByIdAndUpdate(user._id, {
            $set : {
                cart : cart._id
            }
        });

        return res.status(200).json({ 
            message: "Produto adicionado ao carrinho.",
            cart: cart 
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
        const userId = req.user.id;

        const user = await User.findById(userId);

        if(!user){
            return res.status(400).json({
                message : "User not found"
            });
        }

        const cart = await Cart.findOne({ user : userId });

        if(!cart) {
            return res.status(404).json({ 
                message: "Carrinho não encontrado." 
            });
        }

        return res.status(200).json({ 
            message: "Carrinho encontrado com sucesso.",
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

        const userId = req.user.id;
        const cart = await Cart.findOne({ user : userId });

        if(!cart) {
            return res.status(404).json({ 
                message: "Carrinho não encontrado." 
            });
        }

        const productIndex = cart.products.findIndex(
            (item) => item.productId.toString() === productId
        );

        if(productIndex === -1){
            return res.status(404).json({
                message : "Product not found in cart"
            });
        }

        const removedProduct = cart.products[productIndex];
        cart.totalPrice -= removedProduct.price * removedProduct.quantity;

        cart.products.splice(productIndex, 1);

        await cart.save();

        if (cart.products.length === 0){
            await User.findByIdAndUpdate(userId, 
                {
                    $unset : {
                        cart: null
                    }
                });
        }

        return res.status(200).json({ 
            message: "Produto removido do carrinho.",
            cart,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message || "Algum erro ocorreu."
        });
    }
};