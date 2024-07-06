import { Router } from "express";
import { check } from "express-validator";
import { validateId } from "../helpers/validateId.js";
import { validateName } from "../helpers/validateName.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validateFields } from "../middlewares/validateFields.js";
import { ProductController } from "../controllers/productController.js";

export const routesProduct = Router();
const Product = new ProductController();

routesProduct.post('/create', [
    validateToken,
    check('name').custom((name) => validateName(name, 'Product')),
    check('description', 'La descripción del producto es requerida.').notEmpty().escape(),
    check('purchasePrice', 'El precio de compra es requerido').isFloat({ min: 100 }).escape(),
    check('salePrice', 'El precio de venta es requerido').isFloat({ min: 100 }).escape(),
    check('stock', 'El stock es requerido').isInt({ min: 1 }).escape(),
    check('supplier').custom((id) => validateId(id, 'Supplier')),
    check('category').custom((id) => validateId(id, 'Category')),
    validateFields
], Product.createProduct);

routesProduct.get('/list', [
    validateToken
], Product.listProducts);

routesProduct.put('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Product')),
    validateFields
], Product.updateProduct);

routesProduct.get('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Product')),
    validateFields
],
    Product.getProduct
);

routesProduct.delete('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Product')),
    validateFields
], Product.deleteProduct);