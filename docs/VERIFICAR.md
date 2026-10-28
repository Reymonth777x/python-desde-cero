# Comandos de verificación para el humano

## Primera instalación (desde clon limpio)

```powershell
# 1. Clonar y entrar al repositorio
git clone <repositorio>
cd python-desdecero

# 2. Crear rama de trabajo (nunca trabajar en main)
git checkout -b producto-v1

# 3. Instalar dependencias (postinstall restaura Pyodide y Monaco)
npm install

# 4. Copiar variables de entorno
Copy-Item .env.example .env.local
# Editar .env.local con los valores correctos (NUNCA commitear valores reales)

# 5. Verificar entorno
npm run doctor

# 6. Levantar Supabase local (requiere Docker Desktop + WSL 2)
#    Si Docker no está disponible, marcar como NO EJECUTADO
npx supabase start
npx supabase test db

# 7. Levantar servidor de desarrollo
npm run dev
# Abrir http://localhost:3000
```

## Verificación de calidad (CI)

```powershell
# TypeScript
npx tsc --noEmit

# Pruebas unitarias
npx vitest run

# Build de producción
npm run build

# ESLint (puede colgarse en este entorno; archivos individuales pasan)
npx eslint . --max-warnings 0
```

## Verificación de funcionalidad

- `http://localhost:3000` muestra la portada sin errores de consola
- `http://localhost:3000/login` carga el formulario de acceso
- `http://localhost:3000/academia` redirige a login sin sesión
- Turtle de la portada ejecuta y renderiza SVG
- Cambio de tema transforma la interfaz (una vez completado H1)

## Qué está NO EJECUTADO / NO VERIFICADO en H0

1. Supabase local (sin Docker/Supabase CLI disponible localmente)
2. `supabase test db` (pgTAP)
3. `npm run lint` scope completo (se cuelga en este entorno)
