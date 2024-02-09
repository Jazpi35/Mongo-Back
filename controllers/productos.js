const { response } = require ('express');
const { Producto, Categoria } = require ('../models');


// Obtener productos - paginado - total - populate
const obtenerProductos = async (req , res = response ) => {
    
    const { limite=15, desde = 0 } = req.query;
    const query = { estado: true };
    // Enviamos desde la url desde que usuario hasta donde mostrar
    // Se utiliza la promesa por que ejecuta los dos await al mismo tiempo
    // y no dispara hasta que no acabe
    
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number( limite))
    ]);

    res.json({
        total,
        Producto
    });
    
}
// Obtener productos por id

const obtenerProducto = async ( req, res = response ) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario' , 'nombre');

    res.json ( categoria );

}

const crearProducto =  async (req, res= response ) => {

    // Leo el body lo capitalizo en mayuscula para la comparacion    
    const nombre = req.body.nombre.toUpperCase();

    // Valido si existe un producto con ese nombre
    const productoDB = await Producto.findOne ({nombre});
    //const categoriaDB = await Categoria.findOne ({nombre});

    // Validamos que el producto no exista. SI existe
    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }
    // Validamos que la categoria exista
    /*if ( !categoriaDB ) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }*/

    //Genero la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const producto = new Producto (data);

    //Guardar en BD

    await producto.save ();

    res.status(200).json(producto);

}

const actualizarProducto = async (req, res=response ) => {
    
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

const borrarProducto = async (req, res=response ) => {
    
    const { id } = req.params;
    const categoriaBorrada = await Categoria.findByIdAndUpdate (id, { estado: false }, {new: true});
    
    res.status(201).json({
        msg: 'Categoria Eliminada Correctamente',
        categoriaBorrada
    });
}

module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    borrarProducto
}