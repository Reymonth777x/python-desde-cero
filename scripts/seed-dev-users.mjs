#!/usr/bin/env node
/**
 * Creates local-only test accounts for Supabase development.
 * Refuses every remote hostname to prevent accidental production changes.
 */
import { randomBytes } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = process.env.SUPABASE_URL || 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

let parsedUrl;
try {
  parsedUrl = new URL(SUPABASE_URL);
} catch {
  console.error('ERROR: SUPABASE_URL must be a valid local URL.');
  process.exit(1);
}

if (!['localhost', '127.0.0.1'].includes(parsedUrl.hostname)) {
  console.error('ERROR: seed-dev-users.mjs only permits localhost or 127.0.0.1.');
  process.exit(1);
}

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('ERROR: set SUPABASE_SERVICE_ROLE_KEY using the local value from npx supabase status -o env.');
  console.error('Never use a production key and never commit or share this value.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
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

async function main() {
  console.log('Creating test accounts in local Supabase only...');

  const { data: usersResult, error: listError } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    throw new Error('Could not list local users: ' + listError.message);
  }

  const existingUsers = usersResult.users;
  const credentials = [];
  let hadFailure = false;

  for (const user of DEV_USERS) {
    const password = randomBytes(24).toString('base64url');
    const existing = existingUsers.find((candidate) => candidate.email === user.email);
    const userMetadata = {
      full_name: user.full_name,
      role: user.role,
    };

    try {
      if (existing) {
        const { error } = await supabase.auth.admin.updateUserById(existing.id, {
          password,
          user_metadata: userMetadata,
          email_confirm: true,
        });
        if (error) throw new Error(error.message);
        console.log('Updated local account: ' + user.email);
      } else {
        const { error } = await supabase.auth.admin.createUser({
          email: user.email,
          password,
          user_metadata: userMetadata,
          email_confirm: true,
        });
        if (error) throw new Error(error.message);
        console.log('Created local account: ' + user.email);
      }

      credentials.push({
        email: user.email,
        password,
        role: user.role,
      });
    } catch (error) {
      hadFailure = true;
      console.error('Failed for ' + user.email + ': ' + (error instanceof Error ? error.message : String(error)));
    }
  }

  if (credentials.length > 0) {
    const credentialsPath = path.join(ROOT, '..', '.local-dev-users.json');
    writeFileSync(
      credentialsPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          supabaseUrl: SUPABASE_URL,
          users: credentials,
        },
        null,
        2,
      ) + '\n',
      { mode: 0o600 },
    );
    console.log('Local credentials saved to .local-dev-users.json (git-ignored). Do not share or commit this file.');
  }

  if (hadFailure) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('Fatal error: ' + (error instanceof Error ? error.message : String(error)));
  process.exitCode = 1;
});