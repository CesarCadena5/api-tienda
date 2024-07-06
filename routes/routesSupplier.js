import { Router } from "express";
import { check } from "express-validator";
import { validateId } from "../helpers/validateId.js";
import { validateName } from "../helpers/validateName.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validateFields } from "../middlewares/validateFields.js";
import { SupplierController } from "../controllers/supplierController.js";

export const routesSupplier = Router();
const Supplier = new SupplierController();

routesSupplier.post('/create', [
    validateToken,
    check('name').custom((name) => validateName(name, 'Supplier')),
    check('phoneNumber', '10 carácteres para el número de telefono').isLength({ min: 10, max: 10 }).escape(),
    validateFields
],
    Supplier.createSupplier
);

routesSupplier.get('/list', [
    validateToken
],
    Supplier.listSuppliers
);

routesSupplier.get('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Supplier')),
    validateFields
],
    Supplier.getSupplier
);

routesSupplier.put('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Supplier')),
    validateFields
],
    Supplier.updateSupplier
);

routesSupplier.delete('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Supplier')),
    validateFields
],
    Supplier.deleteSupplier
);