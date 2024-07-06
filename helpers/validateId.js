import { Types } from "mongoose";
import { User } from "../models/UserModel.js";
import { Order } from "../models/OrderModel.js";
import { Sale } from "../models/SalesModel.js";
import { Product } from "../models/ProductModel.js";
import { Category } from "../models/CategoryModel.js";
import { Supplier } from "../models/SupplierModel.js";
import { Customer } from "../models/CustomerModel.js";

export const validateId = async (id, type) => {
    if (!Types.ObjectId.isValid(id)) {
        throw new Error('El ID proporcionado, no es válido');
    }

    let idExist = null;

    switch (type) {
        case 'Category':
            idExist = await Category.findById(id);
            break;
        case 'User':
            idExist = await User.findById(id);
            break;
        case 'Product':
            idExist = await Product.findById(id);
            break;
        case 'Supplier':
            idExist = await Supplier.findById(id);
            break;
        case 'Customer':
            idExist = await Customer.findById(id);
            break;
        case 'Order':
            idExist = await Order.findById(id);
            break;
        case 'Sale':
            idExist = await Sale.findById(id);
            break;

        default:
            break;
    }

    if (!idExist || !idExist.status) {
        throw new Error(`El registro ${id} no existe para ningún registro.`);
    }
};