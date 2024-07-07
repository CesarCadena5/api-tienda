import bcryptjs from 'bcryptjs';
import { User } from "../models/UserModel.js";
import { generateToken } from '../helpers/generateToken.js';

export class UserController {
    async create(req, res) {
        const { name, email, password } = req.body;

        try {
            const user = new User({ name, email, password });
            const salt = bcryptjs.genSaltSync(12);
            const hashPassword = bcryptjs.hashSync(password, salt);
            user.password = hashPassword;

            const userSave = await user.save();
            const token = await generateToken(userSave._id);

            res.cookie('access_token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
                secure: true,
                sameSite: 'None'
            }).json({
                icon: 'success',
                msg: 'Usuario creado con éxito.',
                userName: userSave.name
            });

        } catch (error) {
            return res.status(500).json({
                icon: 'error',
                error: 'Ocurrió un error al crear el usuario.'
            });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({
                    icon: 'error',
                    error: 'Usuario y/o contraseña incorrecta.'
                });
            }

            const validPassword = bcryptjs.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    icon: 'error',
                    error: 'Usuario y/o contraseña incorrecta.'
                });
            }

            const token = await generateToken(user._id);

            res.cookie('access_token', token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60
            }).json({
                icon: 'success',
                msg: 'Login éxitoso',
                userName: user.name
            });
        } catch (error) {
            return res.status(500).json({
                error: 'Comuniquese con el administrador.'
            });
        }
    }

    async logout(req, res) {
        try {
            res.cookie('access_token', '', {
                httpOnly: true,
                expires: new Date(0)
            }).json({
                icon: 'success',
                msg: 'Logout éxitoso'
            });
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error: 'Comuniquese con el administrador.'
            });
        }
    }
};