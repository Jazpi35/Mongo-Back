const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        require: [true, "El nombre es obligatorio"],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    //Esta forma de declarar el usuario se asemeja 
    //A una relacion de tablas
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { type: String },
    disponible: { type: Boolean, default: true },
});

ProductoSchema.methods.toJSON = function (){
    // retiro el --V
    const {__v, estado, ...data } = this.toObject();
    return data;
}


module.exports = model('Producto', ProductoSchema);