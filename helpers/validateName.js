import { Product } from "../models/ProductModel.js";
import { Supplier } from "../models/SupplierModel.js";
import { Category } from "../models/CategoryModel.js";
import { Customer } from "../models/CustomerModel.js";

export const validateName = async (name = '', typeModule) => {
    if (!name) {
        throw new Error('El nombre es requerido');
    }

    let model = null;
    switch (typeModule) {
        case 'Category':
            model = Category;
            break;

        case 'Product':
            model = Product;
            break;

        case 'Supplier':
            model = Supplier;
            break;

        case 'Customer':
            model = Customer;
            break;

        default:
            break;
    }

    const nameExist = await model.findOne({ name, status: true });
    if (nameExist) {
        throw new Error(`El nombre ${name}, ya está registrado. Use otro.`);
    }
}