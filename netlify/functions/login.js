import { createClient } from '@supabase/supabase-js';

// La función que se ejecutará cuando el cliente intente iniciar sesión
exports.handler = async (event) => {
  // Solo aceptamos solicitudes POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Obtenemos los datos del cliente (email y password)
  const { email, password } = JSON.parse(event.body);

  // Verificamos que el email y la contraseña no estén vacíos
  if (!email || !password) {
    return { statusCode: 400, body: "Email and password are required" };
  }

  // Aquí necesitas la URL y la API Key de Supabase
  const SUPABASE_URL = "https://dothtuwrsplezhaxkjmw.supabase.co"; // Esta es la URL de tu proyecto
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvdGh0dXdyc3BsZXpoYXhramwNCiBw.B13yokCG9VQ49kjZ5pHeBdqBtW7i2CP8yg2l2Ekhqnc";

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  const { data: usuarios, error } = await supabase
    .from('taller_usuarios') // <-- MODIFICACIÓN: Se usa la tabla 'taller_usuarios'
    .select('email, password')
    .eq('email', email)
    .single();

  if (error || !usuarios) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Usuario no encontrado" }),
    };
  }

  if (usuarios.password !== password) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Contraseña incorrecta" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Login exitoso!" }),
  };
};
