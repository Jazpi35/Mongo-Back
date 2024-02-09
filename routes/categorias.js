const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares');
const { validarJWT, esAdminRole } = require('../middlewares');
const { crearCategoria,
        obtenerCategorias,
        obtenerCategoria,
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');

const router = Router();

// Obtener todas las categorias - publico 
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico 
router.get('/:id', [
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id', existeCategoriaPorId),
    validarCampos
], obtenerCategoria)

// Crear categoria - privado - cualquier persona con token valido 
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquiera con token valido 
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id', existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

// Borrar una categoria- Admin - cambio de estado
router.delete ('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id de Mongo Valido').isMongoId(),
    check('id', existeCategoriaPorId),
    validarCampos
], borrarCategoria );

module.exports = router;