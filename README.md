# 📹 Camera Monitor - Real-time Dashboard

Dashboard en vivo para monitorear cámaras de vigilancia. Muestra el estado de todas las cámaras en tiempo real con énfasis en las que están caídas o no grabando.

## ⚙️ Configuración Inicial (IMPORTANTE)

**Antes de hacer cualquier cosa, necesitas tu session cookie:**

1. Abre https://processing.api.fanaty.com/admin/cameras
2. Presiona F12 (DevTools)
3. Ve a "Network" → Recarga la página
4. Haz click en "Cameras"
5. Ve a "Headers" → "Request Headers"
6. Busca y copia la línea que dice `cookie: session=...`
7. Crea un archivo `.env.local` en la raíz del proyecto:

```
CAMERA_SESSION_COOKIE=session=eyJ1c2VybmFtZSI6Im5hY2hvIn0.adPCWA.tIn4F4skBuqGZvdVRJwD-TW8vZI
```

(Reemplaza con tu cookie real)

**Sin esto, no funcionará.**

## Características

- 🚨 Alertas críticas para cámaras en rojo y naranja
- 📊 Estadísticas en tiempo real
- 🔍 Búsqueda por nombre, IP o MAC
- 🔄 Actualización automática cada 15 segundos
- 📱 Diseño responsive
- ⏸️ Control para pausar/reanudar

## Requisitos

- Node.js 14+ 
- npm o yarn

## Instalación Local

1. **Clona o descarga el proyecto**
   ```bash
   git clone <tu-repo>
   cd camera-monitor
   ```

2. **Instala dependencias**
   ```bash
   npm install
   ```

3. **Ejecuta en desarrollo**
   ```bash
   npm run dev
   ```

   Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Deploy en Vercel

### Opción 1: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/camera-monitor.git
   git push -u origin main
   ```

2. **Conecta Vercel a tu repositorio**
   - Ve a [vercel.com](https://vercel.com)
   - Haz click en "New Project"
   - Importa tu repositorio de GitHub
   - Click en "Deploy"

### Opción 2: Deploy directo con Vercel CLI

1. **Instala Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Sigue las instrucciones en la terminal**

## Variables de Entorno

Si necesitas cambiar la URL de la API, crea un archivo `.env.local`:

```
NEXT_PUBLIC_API_URL=https://processing.api.fanaty.com/admin/cameras
```

Luego actualiza el archivo `pages/index.js`:

```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://processing.api.fanaty.com/admin/cameras';
```

## Estructura del Proyecto

```
camera-monitor/
├── pages/
│   └── index.js          # Página principal
├── styles/
│   └── Dashboard.module.css   # Estilos
├── public/               # Assets estáticos
├── package.json
├── next.config.js
└── README.md
```

## Troubleshooting

### Error de CORS
Si ves errores de CORS, es normal. El navegador no puede acceder directamente a la API. Soluciones:

1. **Usar un proxy CORS** (temporal)
2. **Backend adicional** para hacer las requests
3. **Configurar CORS en el servidor** de cámaras

### El dashboard no se actualiza
- Verifica que la API esté accesible
- Revisa la consola del navegador (F12) para ver errores
- Asegúrate de que la URL de la API es correcta

## Cambios Personalizados

### Cambiar el intervalo de actualización
En `pages/index.js`, línea ~78:
```javascript
const interval = setInterval(fetchCameras, 15000); // 15 segundos
```

### Cambiar colores
En `styles/Dashboard.module.css` busca los colores y cámbialos.

### Agregar más filtros
Modifica el objeto `statusConfig` en `pages/index.js`.

## Licencia

MIT

## Autor

Creado con ❤️
