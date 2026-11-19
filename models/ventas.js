import mongoose from 'mongoose';

const VentaSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    id_usuario: {
        type: Number,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    },
    direccion: {
        type: String,
        required: true
    },
    metodo_pago: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    pagado: {
        type: Boolean,
        default: false
    },
    productos: [{
        id: {
            type: Number,
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        }
    }]
}, {
    timestamps: true
});

export const Venta = mongoose.model('Venta', VentaSchema, 'ventas');