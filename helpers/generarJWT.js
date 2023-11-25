const jwt = require ('jsonwebtoken');



const generarJWT = ( uid = '') => {

   return new Promise ( ( resolve,reject) =>{

     // Solo vamos a grabar el uid
     const payload = { uid };

     // la funcion sign nos permite firmar un nuevo token
     // 1. payload 2. llave secreta 
     // 3. opcines nos permite cuanto tiempo expira
     jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
         expiresIn: '4h'
     }, (err, token) => {
 
         if (err) {
             console.log(err);
             reject('No se pudo generar el token')
         } else {
             resolve(token);
         }
     })
   })
}

module.exports = {
    generarJWT
}