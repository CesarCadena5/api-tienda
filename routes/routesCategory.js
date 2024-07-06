import { Router } from "express";
import { check } from "express-validator";
import { validateId } from "../helpers/validateId.js";
import { validateName } from "../helpers/validateName.js";
import { validateToken } from "../middlewares/validateToken.js";
import { validateFields } from "../middlewares/validateFields.js";
import { CategoryController } from "../controllers/categoryController.js";

export const routesCategory = Router();

const Category = new CategoryController();

routesCategory.post('/create', [
    validateToken,
    check('name').custom((name) => validateName(name, 'Category')),
    validateFields
],
    Category.createCategory
);

routesCategory.get('/list', [
    validateToken
],
    Category.listCategory
);

routesCategory.get('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Category')),
    validateFields
],
    Category.getCategory
);

routesCategory.put('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Category')),
    check('name', 'El nombre es requerido').notEmpty().escape(),
    validateFields
],
    Category.updateCategory
);

routesCategory.delete('/:id', [
    validateToken,
    check('id').custom((id) => validateId(id, 'Category')),
    validateFields
],
    Category.deleteCategory
);