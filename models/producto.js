
import mongoose from 'mongoose';

const ProductoSchema = new mongoose.Schema({

    id: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    disponible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export const Producto = mongoose.model('Producto', ProductoSchema, 'productos');
