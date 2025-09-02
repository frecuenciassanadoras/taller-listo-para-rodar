// Archivo: netlify/functions/taller-login.js

const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Importa la librería JWT

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { email, password } = JSON.parse(event.body);
    // ... (El código de validación de email y password es el mismo) ...

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: usuario, error } = await supabase
      .from('taller_usuarios')
      .select('email, password')
      .eq('email', email)
      .single();

    if (error || !usuario) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Credenciales incorrectas." }),
      };
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);
    
    if (!passwordMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Credenciales incorrectas." }),
      };
    }

    // AHORA: Genera un JWT después de la validación exitosa.
    const token = jwt.sign({ email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Y envía el token en la respuesta.
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Acceso exitoso", token: token }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno del servidor." }),
    };
  }
};
