const  Categoria  = require('../models');
const  Producto  = require('../models');
const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRoleValido = async (rol = '') => {

    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no esta registrado en la BD`);
    }
}


const emailExiste = async ( correo = '' ) => {

    const existeEmail = await Usuario.findOne({ correo: correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo}, ya esta registrado en la BD`)
    }
}

const existeUsuarioPorId = async ( id ) => {
    //Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) {
        throw new Error(`El id: ${ id } de este usuario no existe`);
    }
}


// Valido si existe categoria
const existeCategoriaPorId = async ( id ) => {

    const existeCategoria = await Categoria.findById(id);
    if (!existeCategoria) {
        throw new Error(`El id: ${ id }  de esta categoria no existe`);
    }
}


// Valido si existe producto
const existeProductoPorId = async ( id ) => {

    const existeProducto = await Producto.findById(id);
    if (!existeProducto) {
        throw new Error(`El id: ${ id } no existe`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
}