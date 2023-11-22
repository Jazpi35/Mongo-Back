
const { validationResult } = require('express-validator');

const validarCampos = ( req, res, next) => {

    //Recibo la respuesta y valido si tiene errores 
    // y retorno el error que me llega
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    //  Si llega a este punto sigue con el otro 
    // middlewares hasta acabar con todos y llamar el controlador
    next();
}


module.exports = {
    validarCampos
}