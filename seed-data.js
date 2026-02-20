// seed-data.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './backend/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = require('./backend/supabase');
const bcrypt = require('bcryptjs');

async function seed() {
  console.log('🌱 Iniciando siembra de datos con seguridad...');

  const defaultPassword = await bcrypt.hash('admin123', 10);
  const studentPassword = await bcrypt.hash('estudiante123', 10);

  // 1. Crear Perfil del Profesor (Admin)
  const { data: adminData, error: adminError } = await supabase
    .from('profiles')
    .upsert({
      nickname: 'Profesor Andrés',
      password: defaultPassword,
      full_name: 'Andrés G.',
      birthdate: '1985-05-15',
      role: 'admin',
      photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andres',
      bio: 'Administrador y profesor de la plataforma.'
    }, { onConflict: 'nickname' })
    .select();

  if (adminError) console.error('Error creando admin:', adminError);
  else console.log('✅ Perfil de Profesor listo:', adminData[0]);

  // 2. Crear Estudiante de Prueba
  const { data: studentData, error: studentError } = await supabase
    .from('profiles')
    .upsert({
      nickname: 'EstudiantePrueba',
      password: studentPassword,
      full_name: 'Test Student',
      birthdate: '2010-02-21', // El cumple solicitado: 21 de Febrero
      role: 'student',
      photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test',
      bio: 'Soy un perfil de prueba para verificar las funciones sociales.'
    }, { onConflict: 'nickname' })
    .select();

  if (studentError) console.error('Error creando estudiante:', studentError);
  else {
    console.log('✅ Estudiante de Prueba listo.');

    // 3. Crear una publicación de prueba para el muro
    const { error: postError } = await supabase
      .from('posts')
      .insert({
        profile_id: studentData[0].id,
        content: '¡Hola a todos! Este es mi primer post en el Hub.',
        is_anonymous: false
      });

    if (postError) console.error('Error creando post:', postError);
    else console.log('✅ Post de prueba creado.');
  }

  console.log('✨ Proceso finalizado.');
}

seed();