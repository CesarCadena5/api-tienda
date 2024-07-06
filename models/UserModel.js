import { model, Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        lowercase: true,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es requerido'],
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        min: [8, 'Mínimo 8 carácteres'],
        trim: true
    }
});

export const User = model('User', UserSchema);