import { Router } from "express";
import { check } from "express-validator";
import { validateId } from "../helpers/validateId.js";
import { validateName } from "../helpers/validateName.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validateFields } from "../middlewares/validateFields.js";
import { CustomerController } from "../controllers/customerController.js";

export const routesCustomer = Router();
const Customer = new CustomerController();

routesCustomer.post('/create', [
    validateToken,
    check('name').custom((name) => validateName(name, 'Customer')),
    check('phoneNumber', '10 carácteres para el número de teléfono').isLength({ min: 10, max: 10 }).escape(),
    validateFields
],
    Customer.createCustomer
);

routesCustomer.get('/list', [
    validateToken
],
    Customer.listCustomer
);

routesCustomer.put('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Customer')),
    validateFields
],
    Customer.updateCustomer
);

routesCustomer.get('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Customer')),
    validateFields
],
    Customer.getCustomer
);

routesCustomer.delete('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Customer')),
    validateFields
],
    Customer.deleteCustomer
);