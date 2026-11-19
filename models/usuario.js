
import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({

    id: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    edad: {
        type: Number,

    },
    ocupacion: {
        type: String,
        
    },
    ciudad_natal: {
        type: String,
        
    },
    direccion: {
        type: String,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    contraseña: {
        type: String,
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

export const Usuario = mongoose.model('Usuario', UsuarioSchema, 'usuarios');
