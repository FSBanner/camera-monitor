@echo off
setlocal enabledelayedexpansion

echo.
echo CAMERA MONITOR - DEPLOY
echo.

if not exist "package.json" (
    echo ERROR: No estás en la carpeta camera-monitor
    pause
    exit /b 1
)

set /p GITHUB_USER="Usuario GitHub: "
set /p GITHUB_TOKEN="Token GitHub (ghp_...): "
set /p REPO_NAME="Nombre repositorio [camera-monitor]: "
if "!REPO_NAME!"=="" set REPO_NAME=camera-monitor

echo.
echo Obtén tu session cookie:
echo 1. Abre: https://processing.api.fanaty.com/admin/cameras
echo 2. F12, Network, F5
echo 3. Click Cameras, Headers
echo 4. Busca "cookie:" y copia TODO
echo.
set /p CAMERA_COOKIE="Session cookie (session=...): "

echo.
echo Creando .env.local...
(
    echo CAMERA_SESSION_COOKIE=!CAMERA_COOKIE!
) > .env.local

echo Inicializando Git...
git init
git config user.email "setup@camera-monitor.local"
git config user.name "Camera Monitor"
git add .
git commit -m "Camera Monitor Deploy"
git branch -M main

set REPO_URL=https://!GITHUB_TOKEN!@github.com/!GITHUB_USER!/!REPO_NAME!.git
git remote add origin !REPO_URL! 2>nul || git remote set-url origin !REPO_URL! 2>nul

echo Subiendo a GitHub...
git push -u origin main

if errorlevel 1 (
    echo ERROR: Fallo el push a GitHub
    echo Verifica token y usuario
    pause
    exit /b 1
)

echo.
echo EXITO!
echo.
echo Tu repositorio:
echo https://github.com/!GITHUB_USER!/!REPO_NAME!
echo.
echo SIGUIENTE - Ve a Vercel:
echo 1. https://vercel.com/dashboard
echo 2. New Project
echo 3. Importa tu repo
echo 4. Agrega variable: CAMERA_SESSION_COOKIE
echo 5. Deploy
echo.
pause
