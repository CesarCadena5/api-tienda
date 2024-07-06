import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ProductSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: [true, 'El nombre es requerido'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        lowercase: true,
        required: [true, 'La descripción es requerida'],
        trim: true
    },
    purchasePrice: {
        type: Number,
        required: [true, 'El precio de compra es requerido'],
        trim: true
    },
    salePrice: {
        type: Number,
        required: [true, 'El precio de venta es requerido'],
        trim: true
    },
    stock: {
        type: Number,
        required: [true, 'El stock es requerido'],
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true });

ProductSchema.plugin(mongoosePaginate);
export const Product = model('Product', ProductSchema);