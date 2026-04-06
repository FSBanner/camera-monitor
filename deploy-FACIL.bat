@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion
color 0B

cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║    📹 CAMERA MONITOR - SETUP AUTOMÁTICO                       ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Verificar carpeta correcta
if not exist "package.json" (
    echo ❌ ERROR: No estás en la carpeta correcta
    echo.
    echo ✅ Abre esta carpeta:
    echo    C:\Users\BannerKn\Desktop\camera-monitor
    echo.
    echo ✅ Haz click derecho aquí
    echo ✅ "Open PowerShell window here" (o "Abrir terminal aquí")
    echo ✅ Pega esto:
    echo.
    echo    cd camera-monitor
    echo    .\deploy-FACIL.bat
    echo.
    pause
    exit /b 1
)

REM === PASO 1: USUARIO GITHUB ===
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  PASO 1: Tu usuario de GitHub                                 ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Abre: https://github.com
echo.
echo Mira arriba a la DERECHA, ahí está tu usuario.
echo Ejemplo: nacho (sin @)
echo.
set /p GITHUB_USER="Tu usuario: "

if "!GITHUB_USER!"=="" (
    echo ❌ Necesitas escribir algo
    pause
    exit /b 1
)

REM === PASO 2: TOKEN GITHUB ===
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  PASO 2: Tu token de GitHub                                   ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Abre este link EN OTRO TAB:
echo https://github.com/settings/tokens
echo.
echo Una vez abierto:
echo   1. Click "Generate new token (classic)"
echo   2. Dale nombre: camera-monitor
echo   3. Marca: ✓ repo
echo   4. Scroll abajo, click "Generate token"
echo   5. Copia el código largo (empieza con ghp_)
echo.
echo Después vuelve aquí y pégalo.
echo.
set /p GITHUB_TOKEN="Pega tu token (ghp_...): "

if "!GITHUB_TOKEN!"=="" (
    echo ❌ Necesitas pegar el token
    pause
    exit /b 1
)

REM === PASO 3: SESSION COOKIE ===
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  PASO 3: Tu session cookie                                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo Abre este link EN OTRO TAB:
echo https://processing.api.fanaty.com/admin/cameras
echo.
echo Una vez cargado:
echo   1. Presiona F12 (abre herramientas)
echo   2. Pestaña "Network"
echo   3. Presiona F5 (recarga)
echo   4. Click en "Cameras" (primera línea)
echo   5. Pestaña "Headers"
echo   6. Busca "cookie:" (scrollea si no ves)
echo   7. Copia TODO desde "session=" hasta el final
echo.
echo Después vuelve aquí y pégalo.
echo.
set /p CAMERA_COOKIE="Pega la cookie (session=...): "

if "!CAMERA_COOKIE!"=="" (
    echo ❌ Necesitas pegar la cookie
    pause
    exit /b 1
)

REM === PROCESANDO ===
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ⏳ PROCESANDO...                                              ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Crear .env.local
(
    echo CAMERA_SESSION_COOKIE=!CAMERA_COOKIE!
) > .env.local
echo ✅ Archivo configuración creado

REM Verificar Git
git --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ Git no está instalado
    echo.
    echo Descarga desde: https://git-scm.com/download/win
    echo.
    echo Luego:
    echo   1. Instala (Next, Next, Install)
    echo   2. Reinicia Windows
    echo   3. Vuelve a abrir esta ventana
    echo.
    pause
    exit /b 1
)

REM Inicializar Git
git init >nul 2>&1
git config user.email "setup@camera-monitor.local" >nul 2>&1
git config user.name "Camera Monitor Setup" >nul 2>&1
git add . >nul 2>&1
git commit -m "Camera Monitor - Setup" >nul 2>&1
git branch -M main >nul 2>&1
echo ✅ Git configurado

REM Agregar remote y push
set REPO_URL=https://!GITHUB_TOKEN!@github.com/!GITHUB_USER!/camera-monitor.git
git remote add origin "!REPO_URL!" 2>nul || git remote set-url origin "!REPO_URL!" >nul 2>&1

echo ⏳ Subiendo a GitHub...
git push -u origin main 2>nul

if errorlevel 1 (
    echo.
    echo ❌ Error al subir a GitHub
    echo.
    echo Verifica:
    echo   - Token correcto?
    echo   - Usuario correcto?
    echo.
    pause
    exit /b 1
)

echo ✅ Código en GitHub

REM === SUCCESS ===
cls
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║  ✅ ¡FUNCIONA! Ya casi está                                    ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo.
echo 📋 AHORA TIENES QUE HACER ESTO EN VERCEL:
echo.
echo 1. Abre: https://vercel.com/dashboard
echo    (Si no tienes cuenta, crea una con tu GitHub)
echo.
echo 2. Click: "Add New" → "Project"
echo.
echo 3. Click: "Import Project"
echo.
echo 4. Pega esta URL:
echo    https://github.com/!GITHUB_USER!/camera-monitor
echo.
echo 5. Click: "Continue"
echo.
echo 6. En "Environment Variables" agrega:
echo    Name:  CAMERA_SESSION_COOKIE
echo    Value: (tu cookie)
echo.
echo 7. Click: "Deploy"
echo.
echo 8. ESPERA 2-3 minutos
echo.
echo 9. Vercel te da tu URL, ejemplo:
echo    https://camera-monitor-abc123.vercel.app
echo.
echo 10. GUARDA ESA URL, LA NECESITAS DESPUÉS
echo.
echo.
echo Tu repositorio:
echo https://github.com/!GITHUB_USER!/camera-monitor
echo.
echo.
pause
