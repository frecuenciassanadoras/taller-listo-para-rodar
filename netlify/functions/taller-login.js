exports.handler = async (event, context) => {
  const { email, password } = JSON.parse(event.body);

  // Reemplaza con tus credenciales reales
  const validEmail = 'hola@frecuenciassanadoras.com';
  const validPassword = 'supercontraseña';

  if (email === validEmail && password === validPassword) {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Login successful' }),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Credenciales incorrectas' }),
    };
  }
};
