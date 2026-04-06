@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo.
echo 📹 Camera Monitor - Deploy Automático
echo ==================================
echo.

REM Verificar si estamos en la carpeta correcta
if not exist "package.json" (
    echo ❌ Error: No se encuentra package.json
    echo Asegúrate de estar en la carpeta 'camera-monitor'
    pause
    exit /b 1
)

REM Pedir datos al usuario
set /p GITHUB_USER="👤 Tu usuario de GitHub: "
set /p GITHUB_TOKEN="🔑 Tu token de GitHub (ghp_...): "
set /p REPO_NAME="📍 Nombre del repositorio [camera-monitor]: "
if "!REPO_NAME!"=="" set REPO_NAME=camera-monitor

echo.
echo 🍪 Necesitas tu session cookie
echo Instrucciones:
echo 1. Abre: https://processing.api.fanaty.com/admin/cameras
echo 2. Presiona F12
echo 3. Ve a pestaña "Network"
echo 4. Recarga la página (F5)
echo 5. Click en "Cameras"
echo 6. Pestaña "Headers"
echo 7. Busca "cookie:" y copia TODO
echo.
set /p CAMERA_COOKIE="Pega tu cookie aquí (session=...): "

REM Crear .env.local
(
    echo CAMERA_SESSION_COOKIE=!CAMERA_COOKIE!
) > .env.local
echo ✅ .env.local creado
echo.

REM Verificar si Git está instalado
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Git no está instalado
    echo Descarga desde: https://git-scm.com/download/win
    pause
    exit /b 1
)

REM Inicializar Git
echo 📤 Subiendo a GitHub...
git init >nul 2>&1
git add . >nul 2>&1
git commit -m "Camera Monitor - Auto Deploy" >nul 2>&1
git branch -M main >nul 2>&1

REM Agregar remote
set REPO_URL=https://!GITHUB_TOKEN!@github.com/!GITHUB_USER!/!REPO_NAME!.git
git remote add origin "!REPO_URL!" 2>nul || git remote set-url origin "!REPO_URL!" >nul 2>&1

REM Push a GitHub
git push -u origin main 2>nul
if errorlevel 1 (
    echo ❌ Error al subir a GitHub
    echo Verifica tu token y usuario
    pause
    exit /b 1
) else (
    echo ✅ Código subido a GitHub
    echo.
    echo 🎉 ¡LISTO! Ahora:
    echo 1. Ve a https://vercel.com/dashboard
    echo 2. Click "New Project"
    echo 3. Importa: https://github.com/!GITHUB_USER!/!REPO_NAME!
    echo 4. Agrega variable:
    echo    Nombre: CAMERA_SESSION_COOKIE
    echo    Valor: !CAMERA_COOKIE!
    echo 5. Click "Deploy"
    echo.
    echo Tu repo: https://github.com/!GITHUB_USER!/!REPO_NAME!
    echo.
)

pause
