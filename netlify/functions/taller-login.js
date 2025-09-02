// Archivo: netlify/functions/taller-login.js

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, password } = JSON.parse(event.body);

  if (!email || !password) {
    return { statusCode: 400, body: "Email and password are required" };
  }

  // Usamos variables de entorno para mayor seguridad
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  // Verificamos que las variables de entorno estén cargadas
  if (!supabaseUrl || !supabaseKey) {
      return {
          statusCode: 500,
          body: JSON.stringify({ message: "Las variables de entorno de Supabase no están configuradas." })
      };
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Consulta la tabla 'taller_usuarios'
    const { data: usuario, error } = await supabase
      .from('taller_usuarios')
      .select('email, password')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Credenciales incorrectas" }),
      };
    }

    // Comparamos la contraseña ingresada con la contraseña hasheada en la base de datos
    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Credenciales incorrectas" }),
      };
    }

    // Si todo es correcto, devolvemos un estado 200 (éxito)
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Acceso al taller exitoso!" }),
    };

  } catch (err) {
    // Captura cualquier otro error del servidor
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error en el servidor. Intenta de nuevo." }),
    };
  }
};
