# 🪟 CAMERA MONITOR - GUÍA WINDOWS COMPLETA

## 🎯 ELIGE TU OPCIÓN

### ⭐ OPCIÓN 1: USAR DEPLOY.BAT (RECOMENDADO - MÁS FÁCIL)

**Ventaja:** Solo clicks, sin terminal complicada

#### PASO 1: Navega a la carpeta
```
C:\Users\BannerKn\Desktop\camera-monitor
```

#### PASO 2: Haz doble click en `deploy.bat`
- Se abre una ventana de terminal automáticamente
- Responde las preguntas que aparecen

#### PASO 3: Proporciona los datos

**Pregunta 1:** Tu usuario de GitHub
```
👤 Tu usuario de GitHub: nacho
```
(Presiona Enter)

**Pregunta 2:** Tu token de GitHub
```
🔑 Tu token de GitHub (ghp_...): ghp_abc123def456ghi789jkl012mno345pqr
```
(Presiona Enter)

**Pregunta 3:** Nombre del repositorio
```
📍 Nombre del repositorio [camera-monitor]: 
```
(Solo presiona Enter para usar el default)

**Pregunta 4:** Session Cookie
```
🍪 Pega tu cookie aquí (session=...): session=eyJ1c2VybmFtZSI6Im5hY2hvIn0.adPCWA...
```
(Presiona Enter)

#### PASO 4: Espera
El script:
- ✅ Crea .env.local
- ✅ Sube código a GitHub
- ✅ Te dice qué hacer en Vercel

---

### 🔵 OPCIÓN 2: USAR POWERSHELL (Alternativa)

#### PASO 1: Abre PowerShell
1. Click derecho en `C:\Users\BannerKn\Desktop\camera-monitor`
2. "Open PowerShell window here" (o "Open Windows PowerShell here")
3. Se abre ventana azul

#### PASO 2: Ejecuta el script
Copia esto en la ventana y presiona Enter:

```powershell
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force; .\deploy.ps1
```

#### PASO 3: Responde las preguntas igual que en OPCIÓN 1

---

### 🟢 OPCIÓN 3: GIT BASH (Si Git Bash TE FUNCIONA)

#### PASO 1: Abre Git Bash
1. Ve a `C:\Users\BannerKn\Desktop\camera-monitor`
2. Click derecho → "Git Bash Here"
3. Se abre ventana negra

#### PASO 2: Ejecuta el script
Escribe:
```bash
bash deploy.sh
```
Presiona Enter

#### PASO 3: Responde las preguntas

---

## 🔧 OBTENER LOS DATOS QUE NECESITAS

### 👤 Usuario de GitHub
Tu usuario es el que ves cuando vas a https://github.com

Ejemplo: `nacho` (sin @, sin comillas)

### 🔑 Token de GitHub (PASO A PASO)

1. **Abre:** https://github.com/settings/tokens
2. **Click:** "Generate new token (classic)"
3. **Dale nombre:** "camera-monitor"
4. **Marca:** La opción "repo" ✓
5. **Scroll:** Click "Generate token"
6. **Copia:** El token largo que aparece (empieza con `ghp_`)
7. **⚠️ IMPORTANTE:** No lo cierres, cópialo ahora

Ejemplo de token:
```
ghp_abc123def456ghi789jkl012mno345pqr
```

### 🍪 Session Cookie (PASO A PASO)

1. **Abre:** https://processing.api.fanaty.com/admin/cameras
2. **Presiona:** F12 (abre herramientas de desarrollo)
3. **Ve a:** Pestaña "Network"
4. **Recarga:** Presiona F5
5. **Espera:** Aparecen líneas en Network
6. **Click:** En "Cameras" (la primera línea)
7. **Ve a:** Pestaña "Headers"
8. **Busca:** "cookie:" (scroll hasta encontrarla)
9. **Copia TODO:** Desde `session=` hasta el final
   
   Ejemplo completo:
   ```
   session=eyJ1c2VybmFtZSI6Im5hY2hvIn0.adPCWA.tIn4F4skBuqGZvdVRJwD-TW8vZI
   ```

10. **Pégalo:** En la terminal cuando lo pida

---

## 📋 DESPUÉS: VERCEL

Cuando el script termine, verás algo así:

```
🎉 ¡LISTO! Ahora:
1. Ve a https://vercel.com/dashboard
2. Click 'New Project'
3. Importa: https://github.com/nacho/camera-monitor
4. Agrega variable:
   Nombre: CAMERA_SESSION_COOKIE
   Valor: session=eyJ1c2VybmFtZSI6Im5hY2hvIn0...
5. Click 'Deploy'
```

### SIGUE ESTOS PASOS EN VERCEL:

1. **Abre:** https://vercel.com/dashboard
2. **Click:** "Add New..." → "Project"
3. **Click:** "Import Project"
4. **URL:** Pega tu repo: `https://github.com/tu-usuario/camera-monitor`
5. **Click:** "Continue"
6. **En "Environment Variables":**
   - Variable: `CAMERA_SESSION_COOKIE`
   - Value: Pega tu cookie completa
7. **Click:** "Deploy"
8. **ESPERA:** 2-3 minutos
9. **YA TIENES:** Tu URL de Vercel

---

## ⚠️ PROBLEMAS COMUNES

### "No se encuentra deploy.bat"
❌ Estás en carpeta equivocada
✅ Navega a: `C:\Users\BannerKn\Desktop\camera-monitor`

### "File not found: package.json"
❌ No estás en la carpeta correcta
✅ Abre otra ventana en la carpeta `camera-monitor`

### "Git is not recognized"
❌ Git Bash no está instalado correctamente
✅ Instala desde: https://git-scm.com/download/win

### "Invalid token"
❌ El token es incorrecto
✅ Ve a https://github.com/settings/tokens y genera uno nuevo

### "Permission denied: deploy.ps1"
❌ PowerShell no permite ejecutar scripts
✅ Abre PowerShell como Administrador y ejecuta:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## ✅ RESUMEN RÁPIDO

**LA FORMA MÁS FÁCIL:**

1. Doble click en `deploy.bat`
2. Responde 4 preguntas
3. Ve a Vercel y termina
4. ¡LISTO!

**SI ALGO FALLA:**
- Prueba OPCIÓN 2 (PowerShell)
- O OPCIÓN 3 (Git Bash)

---

## 🚀 SIGUIENTE PASO

Una vez que Vercel te de tu URL (algo como `https://camera-monitor-abc123.vercel.app`):

1. Abre `CODIGO_V0_CON_NEON.jsx`
2. Busca: `const VERCEL_API_URL = 'https://camera-monitor-xxxxx.vercel.app';`
3. Reemplaza `xxxxx` con tu URL real
4. Copia TODO el código
5. Ve a: https://v0.app/chat
6. Pégalo en el chat
7. **¡LISTO!**

---

**Cualquier duda, escribe el error exacto que ves 👍**
