import { createClient } from '@supabase/supabase-js';

// Esta es la nueva función que se ejecutará cuando el cliente intente acceder al taller
exports.handler = async (event) => {
  // Solo acepta solicitudes POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Obtiene los datos del cliente (email y password)
  const { email, password } = JSON.parse(event.body);

  // Verifica que el email y la contraseña no estén vacíos
  if (!email || !password) {
    return { statusCode: 400, body: "Email and password are required" };
  }

  // Aquí necesitas la URL y la API Key de Supabase
  const SUPABASE_URL = "https://dothtuwrsplezhaxkjmw.supabase.co"; // URL de tu proyecto
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvdGh0dXdyc3BsZXpoYXhramwNCiBw.B13yokCG9VQ49kjZ5pHeBdqBtW7i2CP8yg2l2Ekhqnc";

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Consulta la tabla 'taller_usuarios' para autenticar
  const { data: usuarios, error } = await supabase
    .from('taller_usuarios') // <-- La tabla del taller
    .select('email, password')
    .eq('email', email)
    .single();

  if (error || !usuarios) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Credenciales incorrectas" }),
    };
  }

  if (usuarios.password !== password) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Credenciales incorrectas" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Acceso al taller exitoso!" }),
  };
};
