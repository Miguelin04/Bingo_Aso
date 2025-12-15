# 🎱 BingoMaster AI

Un juego de Bingo interactivo con una api de Gemini

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18 o superior)
- Una API Key de [Google Gemini](https://ai.google.dev/)

## 🚀 Instalación y Ejecución

### 1. Clonar o descargar el proyecto

```bash
cd bingo
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar la API Key de Gemini

Crea un archivo `.env.local` en la raíz del proyecto y añade tu API Key:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

> 💡 Puedes obtener tu API Key gratis en [Google AI Studio](https://ai.google.dev/)

### 4. Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación se abrirá automáticamente en tu navegador en `http://localhost:5173`

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila el proyecto para producción |
| `npm run preview` | Previsualiza la versión de producción |

## 🛠️ Tecnologías Utilizadas

- React 19
- TypeScript
- Vite
- Google Gemini AI API
- Lucide React (iconos)
- Canvas Confetti (efectos visuales)
