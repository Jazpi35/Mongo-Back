const { response } = require ('express');
const { Categoria } = require ('../models');


// Obtener categorias - paginado - total - populate

const obtenerCategorias = async (req , res = response ) => {
    
    const { limite=15, desde = 0 } = req.query;
    const query = { estado: true };
    // Enviamos desde la url desde que usuario hasta donde mostrar
    // Se utiliza la promesa por que ejecuta los dos await al mismo tiempo
    // y no dispara hasta que no acabe
    
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number( limite))
    ]);

    res.json({
        total,
        categorias
    });
    
}
// Obtener categorias por id

const obtenerCategoria = async ( req, res = response ) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario' , 'nombre');

    res.json ( categoria );

}

const crearCategoria =  async (req, res= response ) => {

    // Leo el body lo capitalizo en mayuscula para la comparacion    
    const nombre = req.body.nombre.toUpperCase();

    // Valido si existe una categoria con ese nombre
    const categoriaDB = await Categoria.findOne ({nombre});

    // Validamos que la categoria no exista. SI existe
    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //Genero la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
        categoria: req.categoria._id
    }

    const categoria = new Categoria (data);

    //Guardar en BD

    await categoria.save ();

    res.status(200).json(categoria);

}

const actualizarCategoria = async (req, res=response ) => {
    
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.nombre  = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    //Validamos que la categoria que voy a actualizar no este marcada como false
    const categoriaDB = await Categoria.findById(id);

    if (!categoriaDB || categoriaDB.estado === false) {
        return res.status(400).json({
            msg: `La categoría con ID ${id} no existe o su estado es false`,
        });
    }

    const categoria = await Categoria.findByIdAndUpdate (id, data, { new: true});
    
    res.status(201).json({
        msg: 'Categoria Actualizada Correctamente',
        categoria
    });
}

const borrarCategoria = async (req, res=response ) => {
    
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate (id, { estado: false }, {new: true});
    
    res.status(201).json({
        msg: 'Categoria Eliminada Correctamente',
        categoriaBorrada
    });
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}