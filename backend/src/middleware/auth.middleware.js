import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization;

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

export const sellerAuthenticate = (req, res, next) => {
    try {

        if(req.user.role !== "Seller") {
            return res.status(401).json({ 
                message: 'Você não é um vendedor.' 
            });
        }
        
        next();
    }
    catch (err) {
        return res.status(401).json({ 
            message: 'Token invalido.' 
        });
    }
}

export const buyerAuthenticate = async (req, res, next) => {
    try{
        if(req.user.role !== "Buyer"){
            return res.status(401).json({
                message : "You are not a buyer"
            })
        }

        next();
    }
    catch(err){
        return res.status(401).json({
            message : "Invalid Token"
        })
    }
}

export const adminAuthenticate = async (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                message : "You are not an admin"
            });
        }

        next();
    }
    catch(err){
        res.status(401).json({
            message : "Invalid token"
        })
    }
}