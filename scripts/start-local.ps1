[CmdletBinding()]
param(
    [switch]$SkipSeed
)

$ErrorActionPreference = 'Stop'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $projectRoot

function Get-SupabaseLocalEnv {
    # Supabase CLI may write informational service-state messages to stderr
    # even when "status" succeeds. Do not let PowerShell's Stop preference
    # abort before we can inspect the command exit code and parse stdout.
    $previousErrorActionPreference = $ErrorActionPreference
    try {
        $ErrorActionPreference = 'Continue'
        $output = & supabase status --output env 2>&1
        $statusExitCode = $LASTEXITCODE
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }

    if ($statusExitCode -ne 0) {
        throw "No se pudo leer el estado local de Supabase. Ejecuta: supabase status --help"
    }

    $values = @{}
    foreach ($line in $output) {
        $text = [string]$line
        if ($text -match '^\s*(?:export\s+)?(?<name>[A-Z0-9_]+)=(?<value>.*)\s*$') {
            $name = $Matches['name']
            $value = $Matches['value'].Trim()

            if (($value.StartsWith('"') -and $value.EndsWith('"')) -or
                ($value.StartsWith("'") -and $value.EndsWith("'"))) {
                $value = $value.Substring(1, $value.Length - 2)
            }

            $values[$name] = $value
        }
    }

    $apiUrl = $values['API_URL']
    if (-not $apiUrl) { $apiUrl = $values['SUPABASE_URL'] }

    $publishableKey = $values['PUBLISHABLE_KEY']
    if (-not $publishableKey) { $publishableKey = $values['SUPABASE_PUBLISHABLE_KEY'] }
    if (-not $publishableKey) { $publishableKey = $values['ANON_KEY'] }
    if (-not $publishableKey) { $publishableKey = $values['SUPABASE_ANON_KEY'] }

    # Current Supabase CLI emits SECRET_KEY; older CLI versions emit SERVICE_ROLE_KEY.
    $serviceRoleKey = $values['SERVICE_ROLE_KEY']
    if (-not $serviceRoleKey) { $serviceRoleKey = $values['SUPABASE_SERVICE_ROLE_KEY'] }
    if (-not $serviceRoleKey) { $serviceRoleKey = $values['SECRET_KEY'] }
    if (-not $serviceRoleKey) { $serviceRoleKey = $values['SUPABASE_SECRET_KEY'] }

    if (-not $apiUrl -or -not $publishableKey) {
        $names = ($values.Keys | Sort-Object) -join ', '
        throw "Supabase no devolvió API_URL y PUBLISHABLE_KEY/ANON_KEY. Variables detectadas: $names"
    }

    return @{
        ApiUrl = $apiUrl
        PublishableKey = $publishableKey
        ServiceRoleKey = $serviceRoleKey
    }
}

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw 'Docker CLI no está instalado. Abre Docker Desktop o instala Docker Desktop.'
}

Write-Host 'Comprobando Docker Desktop...' -ForegroundColor Cyan
& docker info *> $null
if ($LASTEXITCODE -ne 0) {
    throw 'Docker no responde. Abre Docker Desktop, espera a que indique que está en ejecución y vuelve a ejecutar este script.'
}

if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    throw 'No se encontró Supabase CLI. Comprueba la instalación con: supabase --version'
}

Write-Host 'Iniciando Supabase local. No se enlaza ni se modifica el proyecto remoto...' -ForegroundColor Cyan
$previousErrorActionPreference = $ErrorActionPreference
try {
    $ErrorActionPreference = 'Continue'
    $startOutput = & supabase start 2>&1
    $startExitCode = $LASTEXITCODE
}
finally {
    $ErrorActionPreference = $previousErrorActionPreference
}

$secretsHidden = $false
foreach ($line in $startOutput) {
    $text = [string]$line
    if ($text -match '^\s*│\s*(?:Publishable|Secret|Access Key|Secret Key|Region)\s*│') {
        if (-not $secretsHidden) {
            Write-Host '  [Claves locales ocultas por seguridad]' -ForegroundColor DarkGray
            $secretsHidden = $true
        }
        continue
    }
    Write-Host $text
}

if ($startExitCode -ne 0) {
    throw 'Supabase local no pudo iniciar. Revisa el mensaje anterior y no ejecutes db push ni db reset contra el proyecto remoto.'
}

$local = Get-SupabaseLocalEnv
$developmentEnvPath = Join-Path $projectRoot '.env.development.local'

$envLines = @(
    "NEXT_PUBLIC_SUPABASE_URL=$($local.ApiUrl)",
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=$($local.PublishableKey)",
    'NEXT_PUBLIC_SITE_URL=http://localhost:3000',
    'NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA',
    'TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA'
)

$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($developmentEnvPath, ($envLines -join [Environment]::NewLine) + [Environment]::NewLine, $utf8NoBom)
Write-Host 'Configuración de desarrollo creada para Supabase local (sin mostrar claves).' -ForegroundColor Green

if (-not $SkipSeed) {
    if (-not $local.ServiceRoleKey) {
        throw 'Supabase no devolvió SERVICE_ROLE_KEY/SECRET_KEY; no se crearon usuarios. Comprueba supabase status --output env.'
    }

    $previousUrl = $env:SUPABASE_URL
    $previousKey = $env:SUPABASE_SERVICE_ROLE_KEY

    try {
        $env:SUPABASE_URL = $local.ApiUrl
        $env:SUPABASE_SERVICE_ROLE_KEY = $local.ServiceRoleKey

        Write-Host 'Creando/reiniciando las tres cuentas de prueba locales...' -ForegroundColor Cyan
        & node (Join-Path $projectRoot 'scripts/seed-dev-users.mjs')
        if ($LASTEXITCODE -ne 0) {
            throw 'No se pudieron preparar las cuentas locales.'
        }
    }
    finally {
        if ($null -eq $previousUrl) {
            Remove-Item Env:SUPABASE_URL -ErrorAction SilentlyContinue
        } else {
            $env:SUPABASE_URL = $previousUrl
        }

        if ($null -eq $previousKey) {
            Remove-Item Env:SUPABASE_SERVICE_ROLE_KEY -ErrorAction SilentlyContinue
        } else {
            $env:SUPABASE_SERVICE_ROLE_KEY = $previousKey
        }
    }
} else {
    Write-Host 'Se omitió la creación de cuentas (-SkipSeed).' -ForegroundColor Yellow
}

$portInUse = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($portInUse) {
    throw 'El puerto 3000 ya está ocupado. Detén el servidor anterior con Ctrl+C y vuelve a ejecutar este script.'
}

Write-Host ''
Write-Host 'Listo. Iniciando Next.js contra la base Supabase local:' -ForegroundColor Green
Write-Host '  App:     http://localhost:3000'
Write-Host '  Studio:  http://localhost:54323'
Write-Host '  Usuarios: .local/dev-users.credentials.json'
Write-Host ''
Write-Host 'Pulsa Ctrl+C para detener Next.js. Supabase seguirá activo en Docker.' -ForegroundColor DarkGray

& npm run dev
if ($LASTEXITCODE -ne 0) {
    throw 'El servidor de Next.js terminó con error.'
}
