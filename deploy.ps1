# ✨ Camera Monitor - Automatic Deploy (Windows PowerShell)

Write-Host "📹 Camera Monitor - Deploy Automático" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si estamos en la carpeta correcta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encuentra package.json" -ForegroundColor Red
    Write-Host "Asegúrate de estar en la carpeta 'camera-monitor'" -ForegroundColor Red
    exit 1
}

# Pedir datos al usuario
$GITHUB_USER = Read-Host "👤 Tu usuario de GitHub"
$GITHUB_TOKEN = Read-Host "🔑 Tu token de GitHub (ghp_...)"
$REPO_NAME = Read-Host "📍 Nombre del repositorio [camera-monitor]"
if ([string]::IsNullOrWhiteSpace($REPO_NAME)) {
    $REPO_NAME = "camera-monitor"
}

# Pedir la cookie
Write-Host ""
Write-Host "🍪 Necesitas tu session cookie de:" -ForegroundColor Yellow
Write-Host "https://processing.api.fanaty.com/admin/cameras" -ForegroundColor Cyan
Write-Host "Instrucciones: F12 > Network > Cameras > Headers > Request Headers > busca 'cookie:'" -ForegroundColor Yellow
$CAMERA_COOKIE = Read-Host "Pega tu cookie aquí (session=...)"

# Crear .env.local
$env_content = "CAMERA_SESSION_COOKIE=$CAMERA_COOKIE"
$env_content | Out-File -FilePath ".env.local" -Encoding UTF8
Write-Host "✅ .env.local creado" -ForegroundColor Green

# Verificar si Git está instalado
try {
    git --version > $null 2>&1
} catch {
    Write-Host "❌ Error: Git no está instalado o no está en PATH" -ForegroundColor Red
    Write-Host "Descarga Git desde: https://git-scm.com/download/win" -ForegroundColor Cyan
    exit 1
}

# Inicializar Git
Write-Host ""
Write-Host "📤 Subiendo a GitHub..." -ForegroundColor Cyan

git init 2>&1 | Out-Null
git add . 2>&1 | Out-Null
git commit -m "Camera Monitor - Auto Deploy" 2>&1 | Out-Null
git branch -M main 2>&1 | Out-Null

# Agregar remote con token
$REPO_URL = "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
git remote add origin "$REPO_URL" 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    git remote set-url origin "$REPO_URL" 2>&1 | Out-Null
}

# Push a GitHub
git push -u origin main 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Código subido a GitHub" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 ¡LISTO! Ahora:" -ForegroundColor Green
    Write-Host "1. Ve a https://vercel.com/dashboard" -ForegroundColor Cyan
    Write-Host "2. Click 'New Project'" -ForegroundColor Cyan
    Write-Host "3. Importa: https://github.com/$GITHUB_USER/$REPO_NAME" -ForegroundColor Cyan
    Write-Host "4. Agrega variable de entorno:" -ForegroundColor Cyan
    Write-Host "   Nombre: CAMERA_SESSION_COOKIE" -ForegroundColor Yellow
    Write-Host "   Valor: $CAMERA_COOKIE" -ForegroundColor Yellow
    Write-Host "5. Click 'Deploy'" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Tu repo: https://github.com/$GITHUB_USER/$REPO_NAME" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error al subir a GitHub" -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "- Tu token sea válido" -ForegroundColor Yellow
    Write-Host "- Tu usuario sea correcto" -ForegroundColor Yellow
    Write-Host "- El repo no exista ya" -ForegroundColor Yellow
    exit 1
}
