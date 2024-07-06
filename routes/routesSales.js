import { Router } from "express";
import { check } from "express-validator";
import { validateId } from "../helpers/validateId.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validateFields } from "../middlewares/validateFields.js";
import { SaleController } from "../controllers/saleController.js";

export const routesSales = Router();
const Sale = new SaleController();

routesSales.post('/create', [
    validateToken,
    check('customer').custom((id) => validateId(id, 'Customer')),
    check('totalSale', 'El total mínimo es 100').isFloat({ min: 100 }).escape(),
    check('additionalNote').escape(),
    check('statusSale', 'Estados permitidos: pagada, cancelada, pendiente').isIn(['pagada', 'cancelada', 'pendiente']).escape(),
    check('products', 'Los productos son requeridos').isArray({ min: 1 }),
    validateFields
], Sale.create);

routesSales.put('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Sale')),
    validateFields
], Sale.update);

routesSales.get('/list', [
    validateToken
], Sale.list);

routesSales.get('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Sale')),
    validateFields
],
    Sale.getSale
);

routesSales.delete('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Sale')),
    validateFields
], Sale.delete);

