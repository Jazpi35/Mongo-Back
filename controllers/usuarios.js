const { response, request } = require ('express');
const bcryptjs = require ('bcryptjs');


const Usuario = require ('../models/usuario');


const usuariosGet = async (req=request, res=response) => {

    const { limite=5, desde = 0 } = req.query;
    const query = { estado: true };
    // Enviamos desde la url desde que usuario hasta donde mostrar
    // Se utiliza la promesa por que ejecuta los dos await al mismo tiempo
    // y no dispara hasta que no acabe
    
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number( limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res=response) => {

    const {nombre, correo, password, rol} = req.body;
    const usuario = new Usuario ({nombre, correo, password, rol});

    //Encriptar contraseña
    //Esta funcion permite encryptar la contraseña
    //genSaltSync() son las vueltas que deben de dar para desencriptar
    //por defecto viene en 10 se puede agrandar pero se demora mas en resolver
    const salt = bcryptjs.genSaltSync();
    //Aqui la encrypto
    //hashSync sirve para encryptar en una sola via 
    // y me pide la contraseña y el numero de vueltas
    usuario.password = bcryptjs.hashSync( password, salt );

    //Guardo el usuario
    await usuario.save();

    res.status(201).json({
        msg: 'Usuario Creado Correctamente',
        usuario
    });
}

const usuariosPut = async(req, res=response) => {
    
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //TODO validar contra base de datos 
    if ( password) {
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync( password, salt );
    }

    const usuario = await Usuario.findByIdAndUpdate (id, resto);
    
    res.status(201).json({
        msg: 'Usuario Actualizado Correctamente',
        usuario
    });
}

const usuariosPatch = (req, res=response) => {
    res.json({
        msg: 'Patch Api'
    });
}

const usuariosDelete = async (req, res=response) => {
    
    const  {id}  = req.params;
    
    //Fisicamente lo borramos <---> No recomendado
    //const usuario = await Usuario.findByIdAndDelete( id );

    // Suguerido para mantener la integridad de la informacion
    const usuario = await Usuario.findByIdAndUpdate( id, {estado:false} , {new:true});

    // de la req miro cual es mi usuario autenticado
    //const usuarioAutenticado = req.usuario;

    res.status(201).json({
        msg: 'Usuario Eliminado Correctamente',
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
