#!/usr/bin/env node

import { randomBytes } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.API_URL || 'http://127.0.0.1:54321';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CREDENTIALS_PATH = resolve(process.cwd(), '.local', 'dev-users.credentials.json');

const DEV_USERS = [
  {
    email: 'estudiante1@python-desdecero.local',
    fullName: 'Estudiante de Prueba 1',
    isAdmin: false,
    role: 'student',
  },
  {
    email: 'estudiante2@python-desdecero.local',
    fullName: 'Estudiante de Prueba 2',
    isAdmin: false,
    role: 'student',
  },
  {
    email: 'admin@python-desdecero.local',
    fullName: 'Administrador de Prueba',
    isAdmin: true,
    role: 'admin',
  },
];

function validateLocalTarget() {
  let url;

  try {
    url = new URL(SUPABASE_URL);
  } catch {
    throw new Error('SUPABASE_URL no es una URL válida.');
  }

  const allowedHosts = new Set(['localhost', '127.0.0.1', '[::1]', '::1']);
  if (url.protocol !== 'http:' || !allowedHosts.has(url.hostname)) {
    throw new Error(
      'Por seguridad, seed-dev-users.mjs solo permite una API HTTP local (localhost, 127.0.0.1 o ::1).',
    );
  }

  if (!SERVICE_ROLE_KEY) {
    throw new Error(
      'Falta SUPABASE_SERVICE_ROLE_KEY. Obtenla de "supabase status --output env" y mantenla solo en esta terminal.',
    );
  }
}

function generatePassword() {
  return randomBytes(24).toString('base64url');
}

async function saveCredentials(users) {
  await mkdir(dirname(CREDENTIALS_PATH), { recursive: true });
  await writeFile(
    CREDENTIALS_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        supabaseUrl: SUPABASE_URL,
        note: 'Solo para desarrollo local. No subir este archivo ni reutilizar estas contraseñas en producción.',
        users,
      },
      null,
      2,
    ) + '\n',
    { encoding: 'utf8', mode: 0o600 },
  );
}

async function main() {
  validateLocalTarget();

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: listData, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    throw new Error(`No se pudieron consultar los usuarios locales: ${listError.message}`);
  }

  const existingUsers = listData.users;
  const credentials = [];

  console.log('Preparando cuentas aisladas para pruebas en Supabase local...');

  for (const user of DEV_USERS) {
    const password = generatePassword();
    const existing = existingUsers.find(
      (candidate) => candidate.email?.toLowerCase() === user.email.toLowerCase(),
    );

    let authUser;

    if (existing) {
      const { data, error } = await supabase.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: { full_name: user.fullName },
      });

      if (error || !data.user) {
        throw new Error(
          `No se pudo renovar la cuenta ${user.email}: ${error?.message ?? 'usuario no devuelto'}`,
        );
      }

      authUser = data.user;
      console.log(`Actualizada: ${user.email}`);
    } else {
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password,
        user_metadata: { full_name: user.fullName },
        email_confirm: true,
      });

      if (error || !data.user) {
        throw new Error(
          `No se pudo crear la cuenta ${user.email}: ${error?.message ?? 'usuario no devuelto'}`,
        );
      }

      authUser = data.user;
      existingUsers.push(authUser);
      console.log(`Creada: ${user.email}`);
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(
        {
          id: authUser.id,
          email: user.email,
          full_name: user.fullName,
          is_admin: user.isAdmin,
        },
        { onConflict: 'id' },
      )
      .select('id, is_admin')
      .single();

    if (profileError || !profile) {
      throw new Error(
        `La cuenta ${user.email} existe, pero no se pudo preparar su perfil local: ${profileError?.message ?? 'perfil no devuelto'}`,
      );
    }

    credentials.push({
      email: user.email,
      password,
      role: user.role,
      userId: authUser.id,
      isAdmin: profile.is_admin,
    });

    // Save after each account so a later failure never loses already-issued passwords.
    await saveCredentials(credentials);
  }

  console.log('');
  console.log('Cuentas locales listas:');
  for (const user of credentials) {
    console.log(`- ${user.email} (${user.role}, is_admin=${user.isAdmin})`);
  }
  console.log('');
  console.log(`Contraseñas guardadas localmente en: ${CREDENTIALS_PATH}`);
  console.log('El archivo está excluido de Git. No se imprimen contraseñas en la terminal.');
  console.log('El esquema actual solo tiene is_admin; no se inventó un rol docente.');
}

main().catch((error) => {
  console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
