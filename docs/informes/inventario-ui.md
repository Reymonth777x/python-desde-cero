> **Inventario histórico.** La tabla refleja una captura anterior de la interfaz y no debe usarse como lista actual de funciones. El juego de cocina y los roles que no aparecen en el esquema activo no forman parte del producto publicado. Consulta `docs/team/ESTADO.md` para el estado vigente.

# Inventario de Interfaz de Usuario

Inventario de todos los botones, enlaces y controles interactivos de la aplicación Python desde Cero.

## Navegación Principal

| Elemento | Ubicación | Función | Estado |
|----------|-----------|---------|--------|
| Logo "Python desde cero" | Header | Navega a `/` | ✅ Activo |
| "Volver al inicio" | Header de login | Navega a `/` | ✅ Activo |
| "Academia" | Header | Navega a `/academia` | ✅ Activo |
| "Invitaciones" | Header (solo admin) | Navega a `/admin/invitaciones` | ✅ Activo |
| "Cerrar sesión" | Header | Ejecuta acción logout | ✅ Activo |

## Página de Login (`/login`)

| Elemento | Ubicación | Función | Estado |
|----------|-----------|---------|--------|
| "Iniciar sesión" | Pestaña toggle | Cambia a modo login | ✅ Activo |
| "Crear cuenta" | Pestaña toggle | Cambia a modo signup | ✅ Activo |
| Input correo | Formulario | Campo de entrada email | ✅ Activo |
| Input contraseña | Formulario | Campo de entrada password | ✅ Activo |
| Input nombre completo | Formulario signup | Campo de entrada nombre | ✅ Activo |
| Turnstile widget | Formulario | Verificación CAPTCHA | ✅ Activo |
| "Crear cuenta" | Botón submit signup | Ejecuta acción signup | ✅ Activo |
| "Iniciar sesión" | Botón submit login | Ejecuta acción login | ✅ Activo |
| "Crea una aquí" | Enlace | Cambia a modo signup | ✅ Activo |
| "Solicita restablecimiento" | Enlace | Navega a `/login/forgot-password` | ✅ Activo |

## Laboratorio (`/practica`)

| Elemento | Ubicación | Función | Estado |
|----------|-----------|---------|--------|
| "Ejecutar" | PythonEditor | Ejecuta código Python | ✅ Activo |
| "Ejecutando..." | PythonEditor (durante ejecución) | Estado de ejecución | ✅ Activo |
| "Detener" | PythonEditor (durante ejecución) | Detiene ejecución del worker | ✅ Activo |
| "Ejecutar de nuevo" | PythonEditor (después de ejecutar) | Vuelve a ejecutar código | ✅ Activo |
| "Reintentar carga de Python" | PythonEditor (error) | Reintenta inicializar worker | ✅ Activo |
| "Limpiar gráfico" | TurtleCanvas | Limpia comandos turtle | ✅ Activo |
| Pestañas móvil: Guía, Código, Resultado, Gráficos | PythonEditor | Cambia de panel | ✅ Activo |

## Selector de Temas

| Elemento | Ubicación | Función | Estado |
|----------|-----------|---------|--------|
| Selector de tema | Header/Nav | Abre menú de temas | ✅ Activo |
| Opción "Sistema" | Menú temas | Aplica tema del dispositivo | ✅ Activo |
| Opción "Original" | Menú temas | Aplica tema original | ✅ Activo |
| Opción "Oscuro" | Menú temas | Aplica tema oscuro | ✅ Activo |
| Opción "Drácula" | Menú temas | Aplica tema Drácula | ✅ Activo |
| Opción "Cyberpunk" | Menú temas | Aplica tema Cyberpunk | ✅ Activo |
| Opción "Hacker" | Menú temas | Aplica tema Hacker | ✅ Activo |
| Opción "Rosa" | Menú temas | Aplica tema Rosa | ✅ Activo |

## Juego de Cocina

| Elemento | Ubicación | Función | Estado |
|----------|-----------|---------|--------|
| Mover arriba/abajo/izquierda/derecha | Controles juego | Mueve al chef | ✅ Activo |
| Tomar ingrediente | Controles juego | Toma ingrediente disponible | ✅ Activo |
| Cortar | Controles juego | Corta ingrediente sostenido | ✅ Activo |
| Cocinar en estufa | Controles juego | Pone ingrediente en estufa | ✅ Activo |
| Emplatar | Controles juego | Pone ingrediente en plato | ✅ Activo |
| Servir en mesa | Controles juego | Sirve plato emplatado | ✅ Activo |
| Esperar | Controles juego | Avanza pasos (cocción) | ✅ Activo |

## Páginas de Error

| Elemento | Ubicación | Función | Estado |
|----------|-----------|---------|--------|
| 404 - "Página no encontrada" | `/404` | Enlaces de navegación | ✅ Activo |
| 500 - "Error del servidor" | `/500` | Botón recargar | ✅ Activo |
| Offline | `/offline` | Mensaje de sin conexión | ✅ Informativo |

## Notas

- Todos los botones tienen estados `hover`, `focus-visible` y `disabled` definidos.
- Todos los colores usan variables CSS `var(--theme-*)` para soporte de temas.
- Los controles deshabilitados muestran `opacity-50` y `cursor-not-allowed`.
- No se detectaron controles muertos en la última verificación.