import { Router } from "express";
import { check } from "express-validator";
import { validateId } from "../helpers/validateId.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validateFields } from "../middlewares/validateFields.js";
import { OrderController } from "../controllers/orderController.js";

export const routesOrder = Router();
const Order = new OrderController();

routesOrder.post('/create', [
    validateToken,
    check('supplier').custom((id) => validateId(id, 'Supplier')),
    check('totalPurchase', 'El total mínimo es 100').isFloat({ min: 100 }).escape(),
    check('additionalNote').escape(),
    check('statusOrder', 'Estados permitidos: pagada, cancelada, pendiente').isIn(['pagada', 'cancelada', 'pendiente']).escape(),
    check('products', 'Los productos son requeridos').isArray({ min: 1 }),
    validateFields
], Order.create);

routesOrder.put('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Order')),
    validateFields
], Order.update);

routesOrder.get('/list', [
    validateToken
], Order.list);

routesOrder.get('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Order')),
    validateFields
],
    Order.getOrder
);

routesOrder.delete('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Order')),
    validateFields
], Order.deleteOrder);

