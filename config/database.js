
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const conectarDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('La variable MONGO_URI no está definida en el archivo .env');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB exitosamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
};
