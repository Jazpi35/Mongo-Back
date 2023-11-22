const { Router } = require('express');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { check } = require('express-validator');
const router = Router();

const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');


router.get('/', usuariosGet);

//La segunda posicion es para el midelware 
//Como se van a validar varios campos se pone en forma de []
//Entonces valido que el correo sea un email y no algo diferente
//Por que le estoy esoecificando que el campo del body correo necesito validar
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser mas de 8 letras').isLength({ min: 8 }),
    check('correo').custom(emailExiste),
    //check('rol','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    // este revisa los errores de cada uno de los checks
    // si pasa ejecuta el controlador si no pailas
    //CHECK ROL
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

router.put('/:id', [
    //Valido con las funciones de Evalidator si el id existe
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPut);

router.patch('/', usuariosPatch);

router.delete('/:id', [
    //Valido con las funciones de Evalidator si el id existe
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

module.exports = router;