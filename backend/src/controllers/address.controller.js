import Address from '../model/address.model.js';
import User from '../model/user.model.js';

export const updateAddress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { street, city, state, zip, country } = req.body;

        if(!street || !city || !state || !zip || !country) {
            return res.status(400).json({ 
                message: "Todos os campos são obrigatórios." 
            });
        }

        //Encontrar usuário
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({ 
                message: "Usuário não encontrado." 
            });
        }

        //Atualizar usuário
        const updateUser = await Address.findOneAndUpdate({
            user: userId
        },
        {
            $set : {
                street,
                city,
                state,
                zip,
                country
            }
        } , {
            new: true,
        }).select("-password");

        return res.status(200).json({ 
            message: "Endereço atualizado com sucesso.",
            data: updatedUser 
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ 
            message: err.message || "Qualquer erro ao atualizar o endereço." 
        });
    }
};