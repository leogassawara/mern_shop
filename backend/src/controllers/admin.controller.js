import Admin from "../model/admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({ 
                message: "Name, email and password are required." 
            });
        }

        const admin = await Admin.findOne({ email });

        if(admin) {
            return res.status(400).json({ 
                message: "Admin with this email already exists." 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await Admin.create({
            name,
            email,
            password: hashedPassword
        });


        const payload = {
            _id: newAdmin._id,
            role : 'Admin',
            email: newAdmin.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { 
            expiresIn: '1d' 
        });

        return res.status(201).json({ 
            message: "Admin registered successfully.", 
            admin: newAdmin,
            token 
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ 
            message: err.message || "Internal server error." 
        });
    }
}

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({ 
                message: "Email and password are required." 
            });
        }

        const admin = await Admin.findOne({ email });

        if(!admin) {
            return res.status(400).json({ 
                message: "Admin not found." 
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, admin.password);

        if(!isPasswordCorrect) {
            return res.status(400).json({ 
                message: "Invalid password and/or email." 
            });
        }


        const payload = {
            id : admin._id,
            role : 'Admin',
            email: admin.email
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { 
            expiresIn: '1d' 
        });

        return res.status(200).json({ 
            message: "Admin logged in successfully.", 
            token,
            admin,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message || "Internal server error."
        });
    }
}

export const getAdmin = async (req, res) => {
    try {

        const adminId = req.user._id;

        if(!adminId) {
            return res.status(400).json({ 
                message: "Admin ID is required." 
            });
        }

        const admin = await Admin.findById(adminId);

        if(!admin) {
            return res.status(404).json({ 
                message: "Admin not found." 
            });
        }

        return res.status(200).json({ 
            message: "Admin fetched successfully.", 
            admin 
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message || "Internal server error."
        });
    }   
}