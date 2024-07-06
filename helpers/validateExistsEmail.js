import { User } from "../models/UserModel.js";

export const validateExistsEmail = async (email = '') => {
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (email === "") {
        throw new Error('El correo es requerido');
    }

    if (!regexEmail.test(email)) {
        throw new Error('El correo es inválido');
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
        throw new Error('El correo ya está registrado para otro usuario.');
    }
};