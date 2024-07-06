import { Types } from "mongoose";
import { Product } from "../models/ProductModel.js";

export const validateFormatProducts = async (products) => {
    const productsInvalid = [];
    const productsValid = [];
    const fieldsRequired = ['productId', 'quantity', 'priceUnit', 'totalPrice'];

    for (const element of products) {
        const productKeys = Object.keys(element);
        const hasAllKeys = fieldsRequired.every(key => productKeys.includes(key));

        if (hasAllKeys && Types.ObjectId.isValid(element.productId)) {
            try {
                const productExist = await Product.findById(element.productId);
                if (productExist) {
                    element.name = productExist.name;
                    productsValid.push(element);
                } else {
                    productsInvalid.push(element);
                }
            } catch (error) {
                productsInvalid.push(element);
            }
        } else {
            productsInvalid.push(element);
        }
    }

    return {
        productsValid,
        productsInvalid
    }
}

// cual es la solución que más se ajusta al reto. Se pueden crear soluciones, o ajustarsen las que están
// Escogemos esa solución, y la explicamos minuciosamente, más concisa. Y la ponemos en práctica.
// Por ejemplo, si la solución es recoger basuras, pues esa se implementa y se explica
// Es implementar la solución, probar como nos va, se prueba, sacar fotos, estadisticas, sondeos
// Luego describimos que recursos necesitamos, para implementar esa solución. Todos, en un listado
// Poner en acción la solución. 