const { Schema, model} = require ('mongoose');
const UsuarioSchema = Schema({
    nombre: {
        type: String,
        require: [true,'El nombre es obligatorio']
    },
    correo: {
        type: String,
        require: [true,'El correo es obligatorio'],
        unique: true 
    },
    password: {
        type: String,
        require: [true,'La contraseña es obligatoria']
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE','USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

// esta funcion me permite sacar de forma global el password 
// Mediante toJSON cuando invoquen este metodo se activa la funcion
// y devuelve solo los usuarios como se los estoy enviando

UsuarioSchema.methods.toJSON = function (){
    // retiro el password y envio usuario
    const {__v, password, ...usuario } = this.toObject();
    return usuario;
}



module.exports = model('Usuario',UsuarioSchema);