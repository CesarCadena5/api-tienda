import { Schema, model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const OrderSchema = new Schema({
    supplier: {
        type: Schema.Types.ObjectId,
        ref: 'Supplier'
    },
    totalPurchase: {
        type: Number,
        required: [true, 'El precio total es requerido'],
        trim: true,
    },
    additionalNote: {
        type: String,
        trim: true,
        lowercase: true
    },
    statusOrder: {
        type: String,
        enum: ['pagada', 'cancelada', 'pendiente'],
        default: 'pagada'
    },
    status: {
        type: Boolean,
        default: true
    },
    products: [{
        productId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true, lowercase: true, trim: true },
        quantity: { type: Number, required: true, trim: true },
        priceUnit: { type: Number, required: true, trim: true },
        totalPrice: { type: Number, required: true, trim: true }
    }]
}, { timestamps: true });

OrderSchema.plugin(mongoosePaginate);

export const Order = model('Order', OrderSchema);