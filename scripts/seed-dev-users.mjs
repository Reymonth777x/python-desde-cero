#!/usr/bin/env node

/**
 * Semilla de usuarios de desarrollo.
 * Solo permite Supabase local (localhost/127.0.0.1/::1).
 * Requiere SUPABASE_SERVICE_ROLE_KEY en el entorno local; nunca la guardes en Git.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54322';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar el hostname exacto: evitar dominios como localhost.example.com.
let supabaseHostname;
try {
  supabaseHostname = new URL(SUPABASE_URL).hostname;
} catch {
  console.error('❌ ERROR: SUPABASE_URL no es una URL válida.');
  process.exit(1);
}
const localHostnames = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
if (!localHostnames.has(supabaseHostname)) {
  console.error('❌ ERROR: seed-dev-users.mjs solo permite Supabase local.');
  console.error('   URL detectada: ' + SUPABASE_URL);
  process.exit(1);
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ERROR: define SUPABASE_SERVICE_ROLE_KEY solo en tu terminal local.');
  console.error('   No la pongas en .env.example, código fuente ni en variables NEXT_PUBLIC_.');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEV_USERS = [
  {
    email: 'estudiante@python-desdecero.local',
    password: 'Estudiante123!',
    role: 'student',
    full_name: 'Estudiante de Prueba',
  },
  {
    email: 'docente@python-desdecero.local',
    password: 'Docente123!',
    role: 'teacher',
    full_name: 'Docente de Prueba',
  },
  {
    email: 'admin@python-desdecero.local',
    password: 'Admin123!',
    role: 'admin',
    full_name: 'Administrador de Prueba',
  },
];

async function main() {
  console.log('🌱 Creando usuarios de desarrollo en Supabase local...\n');

  for (const user of DEV_USERS) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        // role es solo una etiqueta de desarrollo; nunca debe autorizar permisos.
        user_metadata: { full_name: user.full_name },
        email_confirm: true, // Auto-confirmar en entorno local
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          console.log(`⚠️  ${user.email} ya existe, saltando...`);
        } else {
          console.error(`❌ Error creando ${user.email}: ${error.message}`);
        }
      } else {
        if (user.role === 'admin' && data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', data.user.id);
          if (profileError) {
            console.error('⚠️ No se pudo habilitar is_admin para el usuario local: ' + profileError.message);
          }
        }
        console.log('✅ ' + user.email + ' creado (rol: ' + user.role + ')');
      }
    } catch (err) {
      console.error(`❌ Excepción creando ${user.email}: ${err.message}`);
    }
  }

  console.log('\n📋 Credenciales de desarrollo:');
  console.log('----------------------------------------');
  for (const user of DEV_USERS) {
    console.log(`${user.email} / ${user.password} (${user.role})`);
  }
  console.log('----------------------------------------');
  console.log('\n⚠️  Solo para entorno de desarrollo local. Nunca usar en producción.');
}

main().catch((err) => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});