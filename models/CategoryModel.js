import { model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const CategorySchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: [true, 'El nombre de la categoría es requerido'],
        trim: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

CategorySchema.plugin(mongoosePaginate);

export const Category = model('Category', CategorySchema);