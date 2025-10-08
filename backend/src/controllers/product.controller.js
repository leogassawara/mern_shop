import { fileUpload } from '../config/upload.cloudinary.js';
import Product from '../model/product.model.js';
import User from '../models/user.model.js';

export const createProduct = async (req, res) => {
    try {

        const userid = req.userId;

        if(!userid) {
            return res.status(400).json({
                message: 'Por favor, faça login para continuar.'
            });
        }

        const { name, description, prices, category, stock, discount } = req.body;

        if(!name || !description || !prices || !category || !stock || !discount) {
            return res.status(400).json({
                message: 'Por favor, preencha todos os campos obrigatórios.'
            });
        }

        const images = req.files.image;

        if(!images){
            return res.status(400).json({
                message: 'Por favor, envie pelo menos uma imagem do produto.'
            });
        }

        const findUser = await User.findById(userid);

        if(!findUser) {
            return res.status(400).json({
                message: 'Usuário não encontrado.'
            });
        }

        const imageURL = await fileUpload(images);

        const product = await Product.create({
            name,
            description,
            prices,
            imageUrl : imageURL,
            category,
            stock,
            discount,
            userId: findUser._id,
        });

        return res.status(201).json({
            message: 'Produto criado com sucesso.',
            product
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Erro no servidor. Tente novamente mais tarde.'
        });
    }
}

export const updateProduct = async (req, res) => {
    try {
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({
                message: 'ID do produto não fornecido.'
            });
        }

        const userId = req.user.id;

        if(!userId) {
            return res.status(400).json({
                message: 'Por favor, faça login para continuar.'
            });
        }

        const { name, description, prices, category, stock, discount } = req.body;
        const product = await Product.findById(id);

        if(!product) {
            return res.status(400).json({
                message: 'Produto não encontrado.'
            });
        }

        const images = req.files.image;

        if(images){
            const imageURL = await fileUpload(images);
            product.imageUrl = imageURL;
        }

        if(userId !== product.user) {
            return res.status(400).json({
                message: 'Você não tem permissão para atualizar este produto.'
            });
        }

        if(name){
            product.name = name;
        }

        if(description){
            product.description = description;
        }

        if(prices){
            product.prices = prices;
        }

        if(category){
            product.category = category;
        }

        if(stock){
            product.stock = stock;
        }

        if(discount){
            product.discount = discount;
        }

        await product.save();

        return res.status(200).json({
            message: 'Produto atualizado com sucesso.',
            product
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Erro no servidor. Tente novamente mais tarde.'
        });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({
                message: 'ID do produto não fornecido.'
            });
        }

        const userId = req.user.id;

        if(!userId) {
            return res.status(400).json({
                message: 'Por favor, faça login para continuar.'
            });
        }

        const product = await Product.findById(id);

        if(!product) {
            return res.status(400).json({
                message: 'Produto não encontrado.'
            });
        }

        if(userId !== product.user) {
            return res.status(400).json({
                message: 'Você não tem permissão para deletar este produto.'
            });
        }

        await product.delete();

        return res.status(200).json({
            message: 'Produto deletado com sucesso.'
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Erro no servidor. Tente novamente mais tarde.'
        });
    }
}

export const getProducts = async (req, res) => {
    try {
        // Buscando, ordenando e paginando produtos
        const { search, category, maxPrice, minPrice, sortBy, page = 1, limit = 10 } = req.query;

        const filter = {};

        if (search) {
            filter.name = { $regex: search, $options: 'i' }; // Busca por nome (case-insensitive)
        }

        if (category) {
            filter.category = category; // Filtra por categoria
        }

        if (maxPrice) {
            filter.prices = { $lte: maxPrice }; // Filtra por preço máximo
        }

        if (minPrice) {
            filter.prices = { $gte: minPrice }; // Filtra por preço mínimo
        }

        if(sortBy) {
            filter.sortBy = sortBy; // Ordena por
        }

        const products = await Product.find(filter).populate({
            path : "category",
            path : "user",
            path : "ratingAndReview",
            path : "user",
            path : "stock",
            path : "discount"
        }).sort(filter.sortBy).skip((page - 1) * limit).limit(limit);

        return res.status(200).json({
            message: 'Produtos carregados com sucesso.',
            products
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Erro no servidor. Tente novamente mais tarde.'
        });
    }
}

export const getProductById = async (req, res) => {
    try {
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({
                message: 'ID do produto não fornecido.'
            });
        }

        const product = await Product.findById(id).populate({
            path : "category",
            path : "user",
            path : "ratingAndReview",
            path : "user",
            path : "stock",
            path : "discount"
        });

        if(!product) {
            return res.status(400).json({
                message: 'Produto não encontrado.'
            });
        }

        return res.status(200).json({
            message: 'Produto carregado com sucesso.',
            product
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Erro no servidor. Tente novamente mais tarde.'
        });
    }
}