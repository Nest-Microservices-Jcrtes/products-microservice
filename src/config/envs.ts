
import 'dotenv/config';
import * as joi from 'joi';

// Se crea una interface para tipar las variables de entorno que se van a utilizar en la aplicación
interface EnvVars {
    PORT: number;
}

// Se define un esquema de validación para las variables de entorno utilizando joi
// joi es una librería de validación de datos que permite definir esquemas y validar objetos contra esos esquemas
// Aqui lo que se esta haciendo es definir que la variable de entorno PORT es un número y es requerida, y que se permiten otras variables de entorno desconocidas 
// (unknown(true))
const envsSchema = joi.object({
    PORT: joi.number().required()
})
.unknown(true);

// Se valida el objeto process.env contra el esquema definido anteriormente, y se obtiene un objeto con dos propiedades: error y value 
// el process.env viene todas las variables de entorno del sistema operativo y del archivo .env, y se valida que cumplan con el esquema definido
const { error, value } = envsSchema.validate( process.env );
// Si hay un error en la validación, se lanza una excepción con un mensaje que indica que hubo un error de validación de configuración y se incluye el mensaje de 
// error específico.
if ( error ){
     throw new Error( `Config validation error: ${ error.message }`);
}
// Si la validación es exitosa, se asigna el objeto value a una constante envVars, que tiene el tipo EnvVars definido anteriormente. Esto permite acceder a las variables de 
// entorno validadas de manera tipada en el resto de la aplicación.
const envVars: EnvVars = value;

// Se exporta un objeto envs que contiene las variables de entorno validadas y tipadas, en este caso solo la variable PORT. Esto permite acceder a las variables de entorno de 
// manera centralizada y tipada en el resto de la aplicación.
export const envs = {
    port: envVars.PORT,
}