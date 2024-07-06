import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CustomerSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: [true, 'El nombre es requerido'],
        trim: true,
        unique: true
    },
    phoneNumber: {
        type: Number,
        lowercase: true,
        required: [true, 'El número de telefono es requerido'],
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

CustomerSchema.plugin(mongoosePaginate);

export const Customer = model('Customer', CustomerSchema);