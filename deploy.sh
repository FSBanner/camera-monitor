#!/bin/bash

# ✨ Camera Monitor - Automatic GitHub & Vercel Deploy Script

echo "📹 Camera Monitor - Deploy Automático"
echo "=================================="
echo ""

# Verificar si estamos en la carpeta correcta
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json"
    echo "Asegúrate de estar en la carpeta 'camera-monitor'"
    exit 1
fi

# Pedir datos al usuario
read -p "👤 Tu usuario de GitHub: " GITHUB_USER
read -p "🔑 Tu token de GitHub (ghp_...): " GITHUB_TOKEN
read -p "📍 Nombre del repositorio (camera-monitor): " REPO_NAME
REPO_NAME=${REPO_NAME:-camera-monitor}

# Pedir la cookie
echo ""
echo "🍪 Necesitas tu session cookie de https://processing.api.fanaty.com/admin/cameras"
echo "F12 > Network > Cameras > Headers > Request Headers > cookie"
read -p "Pega tu cookie aquí (session=...): " CAMERA_COOKIE

# Crear .env.local
echo "CAMERA_SESSION_COOKIE=$CAMERA_COOKIE" > .env.local
echo "✅ .env.local creado"

# Inicializar Git
echo ""
echo "📤 Subiendo a GitHub..."
git init > /dev/null 2>&1
git add . > /dev/null 2>&1
git commit -m "Camera Monitor - Auto Deploy" > /dev/null 2>&1
git branch -M main > /dev/null 2>&1

# Agregar remote con token
REPO_URL="https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"

# Push a GitHub
if git push -u origin main 2>/dev/null; then
    echo "✅ Código subido a GitHub"
    echo ""
    echo "🎉 ¡LISTO! Ahora:"
    echo "1. Ve a https://vercel.com/dashboard"
    echo "2. Click 'New Project'"
    echo "3. Importa: https://github.com/${GITHUB_USER}/${REPO_NAME}"
    echo "4. Agrega variable: CAMERA_SESSION_COOKIE = $CAMERA_COOKIE"
    echo "5. Click 'Deploy'"
    echo ""
    echo "Tu repo: https://github.com/${GITHUB_USER}/${REPO_NAME}"
else
    echo "❌ Error al subir a GitHub"
    echo "Verifica que tu token sea correcto"
    exit 1
fi
