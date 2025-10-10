import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
       
        const { name, email,  role, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ 
                message: 'Preencha todos os campos.' 
            });
        }

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({ 
                message: 'Usuário já cadastrado.' 
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            role,
            password: passwordHash
        });

        return res.status(201).json({ 
            message: 'Usuário registrado com sucesso.', 
            user
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ 
            message: 'Erro no servidor. Tente novamente mais tarde.' 
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ 
                message: 'Preencha todos os campos.' 
            });
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ 
                message: 'Usuário não encontrado.' 
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(400).json({ 
                message: 'Senha e email incorretos.' 
            });
        }

        const token = jwt.sign({
            id: user._id,
            role: user.role,
            email: user.email
        }, {
            secret : process.env.JWT_SECRET,
            expiresIn: '1d'
        });

        return res.status(200).json({ 
            message: 'Login realizado com sucesso.', 
            token,
            user
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ 
            message: 'Erro no servidor. Tente novamente mais tarde.' 
        });
    }
}

export const gtProfile = async (req, res) => {
    try {
        const {id} = req.user;

        if(!id) {
            return res.status(400).json({ 
                message: 'Por favor, faça login para continuar.' 
            });
        }

        const user = await User.findById(id).populate({
            path : "address",
            path : "cart",
            path : "orders",
            path : "products"
        }).select('-password');

        if(!user) {
            return res.status(400).json({ 
                message: 'Usuário não encontrado.' 
            });
        }

        return res.status(200).json({ 
            message: 'Perfil do usuário carregado com sucesso.', 
            user
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ 
            message: 'Erro no servidor. Tente novamente mais tarde.' 
        });
    }
}

/*export const logout = async (req, res) => {
    try {

    }
    catch (err) {
        console.error(err);
    }
}*/

export const updateProfile = async (req, res) => {
    try {
        const {id} = req.user;

        if(!id) {
            return res.status(400).json({ 
                message: 'Por favor, faça login para continuar.' 
            });
        }

        const { name, email, role, phone } = req.body;
        const user = await User.findById(id);

        if(!user) {
            return res.status(400).json({ 
                message: 'Usuário não encontrado.' 
            });
        }

        if(name){
            user.name = name;
        }

        if(email){
            user.email = email;
        }

        if(role){
            user.role = role;
        }

        if(phone){
            user.phone = phone;
        }

        await user.save();

        return res.status(200).json({ 
            message: 'Perfil do usuário atualizado com sucesso.', 
            user
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ 
            message: 'Erro no servidor. Tente novamente mais tarde.' 
        });
    }
}