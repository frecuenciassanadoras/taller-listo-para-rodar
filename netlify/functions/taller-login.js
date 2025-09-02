// Archivo: netlify/functions/taller-login.js

const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  // 1. Verificar si el método HTTP es POST.
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 2. Analizar el cuerpo de la solicitud para obtener email y contraseña.
    const { email, password } = JSON.parse(event.body);

    // 3. Validar que los campos no estén vacíos.
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email y contraseña son requeridos." }),
      };
    }

    // 4. Obtener las credenciales de Supabase de las variables de entorno.
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Error: Las variables de entorno de Supabase no están configuradas.');
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Error en el servidor. Intenta de nuevo más tarde." }),
      };
    }

    // 5. Crear el cliente de Supabase.
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 6. Consultar la base de datos para encontrar al usuario.
    const { data: usuario, error } = await supabase
      .from('taller_usuarios') // Consulta la tabla del taller
      .select('email, password')
      .eq('email', email)
      .single();

    // 7. Manejar errores de la consulta o si el usuario no existe.
    if (error || !usuario) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Credenciales incorrectas." }),
      };
    }

    // 8. Comparar la contraseña en texto plano (SOLO TEMPORALMENTE).
    // Esta es la única línea que cambia para esta prueba.
    if (password !== usuario.password) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Credenciales incorrectas." }),
      };
    }

    // 9. Si todo es correcto, devolver una respuesta de éxito.
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Acceso al taller exitoso!" }),
    };

  } catch (err) {
    // 10. Manejar cualquier error inesperado del servidor.
    console.error('Error en la función de login:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error interno del servidor." }),
    };
  }
};
