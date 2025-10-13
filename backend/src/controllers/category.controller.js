import Category from '../model/category.model.js';
import Admin from '../model/admin.model.js';

export const createCategories = async (req, res) => {
    try {

        // Encontrar ID do usuário
        const userId = req.user.id;
      
        // Pegar nome da categoria
        const { categoryName } = req.body;

        if(!categoryName) {
            return res.status(400).json({ 
                message: "O nome da categoria é obrigatório." 
            });
        }

        //Encontrar admin
        const admin = await Admin.findOne({ _id : userId });

        if(!admin) {
            return res.status(404).json({ 
                message: "Administrador não encontrado." 
            });
        }

        // Checar se Admin é Admin
        /*if(admin.role !== 'Admin') {
            return res.status(401).json({ 
                message: "Você não é um administrador." 
            });
        }*/

        // Encontrar categorias
        const category = await Category.findOne({ categoryName });

        if(category) {
            return res.status(404).json({ 
                message: "" + categoryName + "já existe." 
            });
        }

        const newCategory = await Category.create({
            categoryName,
            admin : admin._id
        });

        await Admin.findByIdAndUpdate({
            _id : userId
        }, {
            $push : { 
                category : newCategory._id 
            }
        })

        return res.status(201).json({ 
            message: "Categoria criada com sucesso.",
            category: newCategory 
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message || "Qualquer erro ao criar a categoria."
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const getAllCategories = await Category.find({})

        return res.status(200).json({ 
            message: "Categorias buscadas com sucesso.",
            categories: getAllCategories 
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message || "Algum erro ocorreu ao buscar as categorias."
        });
    }
};