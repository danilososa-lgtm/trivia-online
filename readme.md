# 🎮 Trivia Online - Juego tipo Preguntados

Un juego de trivia multijugador con diseño moderno y dinámico, similar a Preguntados.

## 🚀 Tecnologías Utilizadas

- **React** - Framework de JavaScript para crear interfaces de usuario
- **CSS3** - Estilos con animaciones y efectos modernos
- **Lucide React** - Iconos modernos y elegantes

## 📋 Requisitos Previos

Antes de comenzar, necesitas tener instalado en tu PC:

1. **Node.js** (versión 14 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación: `node --version`

2. **npm** (viene incluido con Node.js)
   - Verifica la instalación: `npm --version`

## 🛠️ Instalación Paso a Paso

### 1. Crear la estructura del proyecto

Abre tu terminal/consola y ejecuta:

```bash
# Crear carpeta del proyecto
mkdir trivia-online
cd trivia-online

# Crear estructura de carpetas
mkdir src
mkdir public
```

### 2. Crear los archivos

Crea los siguientes archivos con el contenido proporcionado:

**En la raíz del proyecto:**
- `package.json`

**En la carpeta `src/`:**
- `index.js`
- `index.css`
- `App.js`
- `App.css`

**En la carpeta `public/`:**
- `index.html`

### 3. Instalar dependencias

En la terminal, dentro de la carpeta del proyecto, ejecuta:

```bash
npm install
```

Este comando instalará todas las dependencias necesarias (React, lucide-react, etc.)

### 4. Ejecutar el proyecto

Una vez instaladas las dependencias, ejecuta:

```bash
npm start
```

Esto abrirá automáticamente tu navegador en `http://localhost:3000`

## 🎯 Características del Juego

✨ **Diseño Dinámico**
- Animaciones fluidas y modernas
- Efectos de glassmorphism
- Gradientes de colores vibrantes
- Iconos animados por categoría

🎮 **Funcionalidades**
- Sistema de salas multijugador
- 6 categorías diferentes
- Timer de 15 segundos por pregunta
- Sistema de puntuación con bonus de racha
- Tabla de clasificación final

📱 **Responsive**
- Se adapta a móviles, tablets y escritorio

## 🎨 Categorías

1. 📚 Historia
2. 🔬 Ciencia
3. ⚽ Deportes
4. 🌍 Geografía
5. 🎬 Entretenimiento
6. 🎨 Arte

## 🔧 Comandos Disponibles

```bash
# Iniciar en modo desarrollo
npm start

# Crear versión de producción
npm run build

# Ejecutar tests
npm test
```

## 📦 Para Producción

Si quieres crear una versión optimizada para producción:

```bash
npm run build
```

Esto creará una carpeta `build/` con todos los archivos optimizados listos para desplegar.

## 🌐 Despliegue Online (Opcional)

Puedes desplegar tu juego gratis en:

- **Vercel**: https://vercel.com
- **Netlify**: https://netlify.com
- **GitHub Pages**: https://pages.github.com

## 🎓 ¿Qué lenguajes se utilizan?

1. **JavaScript (React)** - Lógica del juego y componentes
2. **HTML** - Estructura base
3. **CSS3** - Diseño, animaciones y efectos visuales
4. **JSX** - Sintaxis de React que combina HTML y JavaScript

## 💡 Personalización

Puedes personalizar fácilmente:

- **Preguntas**: Edita el objeto `QUESTIONS` en `App.js`
- **Colores**: Modifica los gradientes en `App.css`
- **Categorías**: Agrega nuevas en el objeto `CATEGORIES` en `App.js`
- **Tiempo**: Cambia `setTimeLeft(15)` a otro valor

## 🐛 Solución de Problemas

**Error: "npm no se reconoce"**
- Asegúrate de tener Node.js instalado
- Reinicia tu terminal después de instalar

**Error al instalar dependencias**
- Intenta: `npm cache clean --force`
- Luego: `npm install` de nuevo

**Puerto 3000 en uso**
- La app te preguntará si quieres usar otro puerto
- O cierra otras aplicaciones que usen el puerto 3000

## 📚 Recursos para Aprender Más

- React: https://es.react.dev/
- CSS Animations: https://developer.mozilla.org/es/docs/Web/CSS/CSS_Animations
- JavaScript: https://developer.mozilla.org/es/docs/Web/JavaScript

## 🤝 Contribuir

¡Siéntete libre de agregar más preguntas, categorías o mejoras al diseño!

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso personal y educativo.

---

¡Disfruta jugando Trivia Online! 🎉