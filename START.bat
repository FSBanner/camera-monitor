@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo CAMERA MONITOR SETUP
echo ========================================
echo.

REM Verificar si estamos en la carpeta correcta
if not exist "app.js" (
    echo ERROR: No estás en la carpeta camera-monitor
    echo.
    echo DEBE estar en: C:\Users\BannerKn\Desktop\camera-monitor
    echo.
    echo Pasos:
    echo 1. Abre Explorer
    echo 2. Ve a esa carpeta
    echo 3. Doble click en START.bat DESDE AHI
    echo.
    pause
    exit /b 1
)

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no está instalado
    echo.
    echo Descarga: https://nodejs.org ^(LTS^)
    echo.
    echo Pasos:
    echo 1. Instala Node.js
    echo 2. REINICIA Windows
    echo 3. Abre esta carpeta de nuevo
    echo 4. Doble click en START.bat
    echo.
    pause
    exit /b 1
)

echo OK: Node.js encontrado
echo.

REM Instalar Express si no existe
if not exist "node_modules\express" (
    echo Instalando Express ^(primer vez, 1 minuto^)...
    call npm install express --silent
    if errorlevel 1 (
        echo ERROR: Fallo npm install
        echo.
        echo Prueba manualmente:
        echo npm install express
        echo.
        pause
        exit /b 1
    )
    echo OK: Express listo
)

echo.
echo ========================================
echo INICIANDO SERVIDOR
echo ========================================
echo.
echo URL: http://localhost:3000
echo.
echo Para detener: Ctrl+C
echo.

node app.js
