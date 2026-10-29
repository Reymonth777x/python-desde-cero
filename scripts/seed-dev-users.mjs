#!/usr/bin/env node

import { randomBytes } from 'node:crypto';

/**
 * Semilla de usuarios de desarrollo.
 * Solo permite Supabase local (localhost/127.0.0.1/::1).
 * Requiere SUPABASE_SERVICE_ROLE_KEY en el entorno local; nunca la guardes en Git.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54322';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validar el hostname exacto: evitar dominios como localhost.example.com.
let supabaseHostname;
try {
  supabaseHostname = new URL(SUPABASE_URL).hostname;
} catch {
  console.error('ERROR: SUPABASE_URL no es una URL valida.');
  process.exit(1);
}
const localHostnames = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);
if (!localHostnames.has(supabaseHostname)) {
  console.error('ERROR: seed-dev-users.mjs solo permite Supabase local.');
  console.error('   URL detectada: ' + SUPABASE_URL);
  process.exit(1);
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: define SUPABASE_SERVICE_ROLE_KEY solo en tu terminal local.');
  console.error('   No la pongas en .env.example, codigo fuente ni en variables NEXT_PUBLIC_.');
  process.exit(1);
}
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const DEV_USERS = [
  {
    email: 'estudiante@python-desdecero.local',
    role: 'student',
    full_name: 'Estudiante de Prueba',
  },
  {
    email: 'docente@python-desdecero.local',
    role: 'teacher',
    full_name: 'Docente de Prueba',
  },
  {
    email: 'admin@python-desdecero.local',
    role: 'admin',
    full_name: 'Administrador de Prueba',
  },
];

function generateSecurePassword() {
  return randomBytes(16).toString('base64url');
}

async function main() {
  console.log('Creando usuarios de desarrollo en Supabase local...');

  for (const user of DEV_USERS) {
    const password = generateSecurePassword();
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password,
        user_metadata: { full_name: user.full_name },
        email_confirm: true,
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          console.log(user.email + ' ya existe, saltando...');
        } else {
          console.error('Error creando ' + user.email + ': ' + error.message);
        }
      } else {
        if (user.role === 'admin' && data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', data.user.id);
          if (profileError) {
            console.error('No se pudo habilitar is_admin para el usuario local: ' + profileError.message);
          }
        }
        console.log('Creado ' + user.email + ' (rol: ' + user.role + ')');
      }
    } catch (err) {
      console.error('Excepcion creando ' + user.email + ': ' + err.message);
    }
  }

  console.log('\nCredenciales de desarrollo:');
  console.log('----------------------------------------');
  for (const user of DEV_USERS) {
    console.log(user.email + ' / contrasena generada - ver consola al crear (' + user.role + ')');
  }
  console.log('----------------------------------------');
  console.log('\nSolo para entorno de desarrollo local. Nunca usar en produccion.');
}

main().catch((err) => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
