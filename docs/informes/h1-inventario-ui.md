# Inventario de Interfaz — Hito H1

Este documento inventaria cada botón, enlace y elemento visual interactivo de la plataforma Python desde cero, indicando su función real, estados y si es tema-aware.

## Reglas de interacción

1. Todo elemento interactivo tiene hover: elevación, brillo o escala ≤ 1.03.
2. Todo elemento tiene active: feedback de presión al hacer clic.
3. Todo elemento tiene focus-visible: anillo de foco con --theme-focus-ring.
4. Todo botón tiene cursor correcto: pointer para botones/enlaces, default para deshabilitados.
5. Todo botón deshabilitado tiene opacity-50 y cursor-not-allowed.
6. Respetar prefers-reduced-motion: animaciones desactivadas.
7. Respetar forced-colors: bordes visibles en modo alto contraste.

## Página: Portada (/)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Logo Python desde cero | Navega a la portada | reposo, hover, focus-visible | SÍ |
| Enlace Volver al inicio | Navega a la portada | reposo, hover, focus-visible | SÍ |
| Botón Comenzar a aprender | Redirige a /academia | reposo, hover, active, focus-visible, loading | SÍ |
| Enlace Laboratorio | Redirige a /practica | reposo, hover, focus-visible | SÍ |
| Demo turtle interactiva | Ejecuta código turtle de ejemplo | play, pausa, reiniciar, cambiar ejemplo | SÍ |
| Botón Abrir en laboratorio | Abre ejemplo actual en /practica | reposo, hover, active, focus-visible | SÍ |
| Enlaces del pie de página | Navega a páginas legales | reposo, hover, focus-visible | SÍ |

## Página: Academia (/academia)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Logo Python desde cero | Navega a la portada | reposo, hover, focus-visible | SÍ |
| Enlace Laboratorio | Redirige a /practica | reposo, hover, focus-visible | SÍ |
| Botón Cerrar sesión | Cierra sesión de Supabase | reposo, hover, active, focus-visible, loading | SÍ |
| Selector de tema | Abre menú desplegable de temas | reposo, hover, active, focus-visible, expandido | SÍ |
| Tarjeta de módulo | Muestra título, descripción, progreso | reposo, hover, bloqueado, completado | SÍ |
| Icono Lock (módulo bloqueado) | Indica prerequisito requerido | reposo (solo visual) | SÍ |
| Lección completada (CheckCircle2) | Indica lección aprobada | reposo (solo visual) | SÍ |
| Lección pendiente (Circle) | Indica lección no completada | reposo (solo visual) | SÍ |
| Enlace a lección | Navega a /academia/[moduleId]/[lessonId] | reposo, hover, active, focus-visible, group-hover | SÍ |
| Enlace Abrir el laboratorio | Redirige a /practica | reposo, hover, focus-visible | SÍ |

## Página: Lección (/academia/[moduleId]/[lessonId])

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Botón Lección anterior | Navega a la lección previa | reposo, hover, focus-visible, deshabilitado (primera) | SÍ |
| Botón Siguiente lección | Navega a la lección siguiente | reposo, hover, focus-visible, deshabilitado (última) | SÍ |
| Enlace Volver a la ruta | Redirige a /academia | reposo, hover, focus-visible | SÍ |
| Botón Comprobar respuestas | Envía quiz al servidor para calificación | reposo, hover, active, focus-visible, loading, disabled | SÍ |
| Opción de respuesta (radio) | Selecciona una respuesta del quiz | reposo, hover, active, focus-checked, disabled | SÍ |
| Enlace Ver todos los módulos | Redirige a /academia | reposo, hover, focus-visible | SÍ |

## Página: Laboratorio (/practica)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Enlace Python desde cero | Navega a la portada | reposo, hover, focus-visible | SÍ |
| Enlace Academia | Redirige a /academia | reposo, hover, focus-visible | SÍ |
| Enlace Invitaciones (solo admin) | Redirige a /admin/invitaciones | reposo, hover, focus-visible | SÍ |
| Formulario Cerrar sesión | Cierra sesión de Supabase | reposo, hover, active, focus-visible, loading | SÍ |
| Botón Ejecutar | Ejecuta código Python en el worker | reposo, hover, active, focus-visible, loading, disabled | SÍ |
| Botón Detener | Detiene la ejecución del worker | reposo, hover, active, focus-visible (visible solo mientras corre) | SÍ |
| Botón Limpiar gráfico | Limpia el canvas de turtle | reposo, hover, active, focus-visible, disabled | SÍ |
| Pestaña móvil Guía/Código/Resultado/Gráficos | Cambia panel visible en móvil | reposo, active (seleccionada) | SÍ |

## Página: Login (/login)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Logo Python desde cero | Navega a la portada | reposo, hover, focus-visible | SÍ |
| Enlace Volver al inicio | Navega a la portada | reposo, hover, focus-visible | SÍ |
| Campo Correo electrónico | Entrada de texto para login | reposo, focus, disabled, error | SÍ |
| Campo Contraseña | Entrada de contraseña | reposo, focus, disabled, error | SÍ |
| Botón Iniciar sesión | Autentica al usuario | reposo, hover, active, focus-visible, loading, disabled | SÍ |
| Enlace Crear cuenta | Muestra formulario de registro | reposo, hover, focus-visible | SÍ |
| Campo Código de invitación | Entrada opcional de código | reposo, focus, disabled, error | SÍ |
| Campo Nombre completo | Entrada de texto para registro | reposo, focus, disabled, error | SÍ |
| Botón Crear cuenta | Registra nuevo usuario | reposo, hover, active, focus-visible, loading, disabled | SÍ |
| Widget Turnstile | Verificación CAPTCHA | reposo, cargando, verificado, error | SÍ |
| Enlace Recuperar contraseña | Redirige a /login/forgot-password | reposo, hover, focus-visible | SÍ |

## Página: Recuperar contraseña (/login/forgot-password)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Enlace Volver al acceso | Redirige a /login | reposo, hover, focus-visible | SÍ |
| Campo Correo electrónico | Entrada para solicitud de reset | reposo, focus, disabled, error | SÍ |
| Botón Enviar instrucciones | Envía enlace de reset por correo | reposo, hover, active, focus-visible, loading, disabled | SÍ |
| Widget Turnstile | Verificación CAPTCHA | reposo, cargando, verificado, error | SÍ |

## Página: Restablecer contraseña (/login/reset-password)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Campo Nueva contraseña | Entrada de nueva contraseña | reposo, focus, disabled, error | SÍ |
| Campo Confirma la contraseña | Entrada de confirmación | reposo, focus, disabled, error | SÍ |
| Botón Actualizar contraseña | Actualiza la contraseña | reposo, hover, active, focus-visible, loading, disabled | SÍ |

## Página: Invitaciones (/admin/invitaciones)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Enlace Volver al laboratorio | Redirige a /practica | reposo, hover, focus-visible | SÍ |
| Botón Generar código de invitación | Crea un nuevo código de acceso | reposo, hover, active, focus-visible, loading, disabled | SÍ |
| Badge de estado (Usada/Caducada/Disponible) | Muestra estado de la invitación | reposo (solo visual) | SÍ |

## Página: 404 (/not-found)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Botón Volver al inicio | Navega a / | reposo, hover, active, focus-visible | SÍ |
| Enlace Ir a la academia | Navega a /academia | reposo, hover, active, focus-visible | SÍ |

## Página: 500 (/error)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Botón Recargar página | Recarga la página actual | reposo, hover, active, focus-visible | SÍ |
| Enlace Volver al inicio | Navega a / | reposo, hover, active, focus-visible | SÍ |

## Página: Sin conexión (/offline)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Enlace Abrir laboratorio | Navega a /practica | reposo, hover, active, focus-visible | SÍ |
| Enlace Intentar de nuevo | Recarga la página | reposo, hover, active, focus-visible | SÍ |

## Selector de tema (componente global)

| Elemento | Función | Estados | Tema-aware |
|----------|---------|---------|------------|
| Botón desplegable Tema | Abre/cierra menú de temas | reposo, hover, active, focus-visible, expandido | SÍ |
| Opción de tema (radio/button) | Selecciona y aplica un tema | reposo, hover, active (seleccionado), focus-visible | SÍ |

