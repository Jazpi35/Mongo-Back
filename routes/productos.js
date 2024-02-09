const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares');
const { validarJWT, esAdminRole } = require('../middlewares');
const { crearProducto,
        obtenerProducto,
        obtenerProductos,
        actualizarProducto,
        borrarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId  } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorias - publico 
router.get('/', obtenerProductos);

// Obtener una categoria por id - publico 
router.get('/:id', [
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id', existeProductoPorId),
    validarCampos
], obtenerProducto)

// Crear producto - privado - cualquier persona con token valido 
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

// Actualizar - privado - cualquiera con token valido 
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id', existeCategoriaPorId),
    validarCampos
], actualizarProducto);

// Borrar una categoria- Admin - cambio de estado
router.delete ('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id', existeCategoriaPorId),
    validarCampos
], borrarProducto );

module.exports = router;