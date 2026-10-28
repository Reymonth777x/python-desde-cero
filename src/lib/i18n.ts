export type Locale = 'es';

const messages: Record<Locale, Record<string, string>> = {
  es: {
    // Navigation
    'nav.inicio': 'Inicio',
    'nav.academia': 'Academia',
    'nav.laboratorio': 'Laboratorio',
    'nav.mi-progreso': 'Mi progreso',
    'nav.acceso': 'Acceso',
    'nav.navegacion': 'Navegación',
    'nav.tema': 'Tema',
    'nav.abrir-menu': 'Abrir menú',
    'nav.cerrar-menu': 'Cerrar menú',

    // Homepage
    'home.tagline': 'Python desde cero',
    'home.title': 'Cada programa empieza con una primera línea.',
    'home.subtitle': 'Accede a tus lecciones, practica Python y guarda tus avances mientras avanzas paso a paso en tu ruta de aprendizaje.',
    'home.cta-learning': 'Continuar aprendiendo',
    'home.cta-lab': 'Laboratorio',
    'home.demo-title': 'Ejecuta código Python ahora',
    'home.demo-subtitle': 'Cambia de ejemplo, edita el código y pulsa Ejecutar para ver el resultado en tiempo real.',
    'home.footer': 'Python desde cero · Material educativo propio e independiente.',

    // Login
    'login.title': 'Bienvenido de vuelta',
    'login.signup-title': 'Únete a Python desde cero',
    'login.login-tab': 'Iniciar sesión',
    'login.signup-tab': 'Crear cuenta',
    'login.email': 'Correo electrónico',
    'login.password': 'Contraseña',
    'login.full-name': 'Nombre completo',
    'login.password-hint': 'Mínimo 8 caracteres.',
    'login.btn-login': 'Iniciar sesión',
    'login.btn-signup': 'Crear cuenta',
    'login.no-account': '¿No tienes cuenta?',
    'login.signup-link': 'Crea una aquí',
    'login.forgot': '¿Olvidaste tu contraseña?',
    'login.reset-link': 'Solicita restablecimiento',
    'login.return-home': 'Volver al inicio',

    // Student dashboard
    'student.title': 'Tu panel de aprendizaje',
    'student.subtitle': 'Aquí ves tu progreso, logros y racha. Sigue avanzando lección por lección.',
    'student.lessons-completed': 'Lecciones completadas',
    'student.avg-score': 'Puntaje promedio',
    'student.achievements': 'Logros',
    'student.module': 'Bloque',
    'student.percent-completed': 'completado',
    'student.continue': 'Continuar aprendiendo',
    'student.lab': 'Laboratorio',

    // Common
    'common.speed': 'Velocidad',
    'common.slow': 'Lento',
    'common.normal': 'Normal',
    'common.fast': 'Rápido',
    'common.step-back': 'Paso atrás',
    'common.step-forward': 'Paso adelante',
    'common.restart': 'Reiniciar',
    'common.grid': 'Cuadrícula',
    'common.turtle': 'Tortuga',
    'common.step': 'Paso',
    'common.of': 'de',
  },
};

export function t(key: string, locale: Locale = 'es'): string {
  return messages[locale]?.[key] ?? key;
}