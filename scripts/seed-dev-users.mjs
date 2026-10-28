#!/usr/bin/env node
"""
Script de semilla de usuarios de desarrollo.
Solo funciona contra Supabase LOCAL (localhost:54322).
Rechaza cualquier URL que no sea local para evitar accidentes en producción.
"""

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54322';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.';

// Validar que sea URL local
if (!SUPABASE_URL.includes('localhost') && !SUPABASE_URL.includes('127.0.0.1')) {
  console.error('❌ ERROR: seed-dev-users.mjs solo permite URLs locales (localhost/127.0.0.1)');
  console.error(`   URL detectada: ${SUPABASE_URL}`);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
        email_confirm: true, // Auto-confirmar en entorno local
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          console.log(`⚠️  ${user.email} ya existe, saltando...`);
        } else {
          console.error(`❌ Error creando ${user.email}: ${error.message}`);
        }
      } else {
        console.log(`✅ ${user.email} creado (rol: ${user.role})`);
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