import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const SalesSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: 'Customer'
    },
    statusSale: {
        type: String,
        enum: ['pagada', 'cancelada', 'pendiente'],
        default: 'pagada'
    },
    status: {
        type: Boolean,
        default: true
    },
    totalSale: {
        type: Number,
        required: [true, 'El precio total es requerido'],
        trim: true,
    },
    additionalNote: {
        type: String,
        trim: true,
        lowercase: true
    },
    products: [{
        productId: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true, lowercase: true, trim: true },
        quantity: { type: Number, required: true, trim: true },
        priceUnit: { type: Number, required: true, trim: true },
        totalPrice: { type: Number, required: true, trim: true }
    }]
}, { timestamps: true });

SalesSchema.plugin(mongoosePaginate);
export const Sale = model('Sale', SalesSchema);