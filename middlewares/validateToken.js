import jwt from "jsonwebtoken";
import 'dotenv/config';
import { User } from "../models/UserModel.js";

export const validateToken = async (req, res, next) => {
    try {
        const { access_token: token } = req.cookies;

        if (!token) {
            return res.status(401).json({
                icon: 'error',
                error: 'No existe el token.'
            });
        }

        const { id } = jwt.verify(token, process.env.SECRET_KEY, (err, tokenDecoded) => {
            if (err) {
                throw new Error('Error al validar el token.');
            }

            return tokenDecoded;
        });

        const user = await User.findById(id);

        req.userAuth = user;
        next();
    } catch (error) {
        return res.status(401).json({
            icon: 'error',
            error: error.message
        });
    }
}