import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header.authorization;

        if(!token) {
            return res.status(401).json({ 
                message: 'Por favor, faça login para continuar.' 
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            
            next();
        }
        catch (err) {
        console.error(err);
        return res.status(401).json({ 
            message: 'Token inválido. Por favor, faça login novamente.' 
        });
        }
    }
    catch (err) {
        console.error(err);
    }
}