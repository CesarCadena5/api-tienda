import { Router } from "express";
import { check } from "express-validator";

import { validateFields } from "../middlewares/validateFields.js";
import { UserController } from "../controllers/UserController.js";
import { validateExistsEmail } from "../helpers/validateExistsEmail.js";
import { validateToken } from "../middlewares/validateToken.js";
// import { validateToken } from "../middlewares/validateToken.js";

export const routesAuth = Router();

const User = new UserController();

routesAuth.post('/register', [
    check('name', 'El nombre es requerido').isLength({ min: 5 }).escape(),
    check('email').custom(validateExistsEmail),
    check('password', 'Se require 1 mayúscula, 1 minúscula, 1 dígito, 1 carácter especial y longitud de 8').isStrongPassword().escape(),
    validateFields
],
    User.create
);

routesAuth.post('/login', [
    check('email', 'El email es requerido').isEmail().escape(),
    check('password', 'Se require 1 mayúscula, 1 minúscula, 1 dígito, 1 carácter especial y longitud de 8').isStrongPassword(),
    validateFields
],
    User.login
);

routesAuth.post('/logout', User.logout);

routesAuth.get('/validate-token', validateToken, (req, res) => {
    res.status(200).json({
        tokenValid: true,
        nameUser: req.userAuth.name
    });
});
// routesAuth.post('/logout', [
//     validateToken
// ]
//     , (req, res) => {

//     });

