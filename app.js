const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

// API para hacer el deploy
app.post('/api/deploy', async (req, res) => {
  const { username, token, cookie } = req.body;

  if (!username || !token || !cookie) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    // Crear .env.local
    const envContent = `CAMERA_SESSION_COOKIE=${cookie}\n`;
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ .env.local creado');

    // Comandos git
    const commands = [
      'git init',
      'git config user.email "setup@camera-monitor.local"',
      'git config user.name "Camera Monitor Setup"',
      'git add .',
      'git commit -m "Camera Monitor - Setup"',
      'git branch -M main',
      `git remote add origin https://${token}@github.com/${username}/camera-monitor.git`,
      'git push -u origin main'
    ];

    let output = '';

    for (const cmd of commands) {
      await new Promise((resolve, reject) => {
        exec(cmd, { cwd: __dirname }, (error, stdout, stderr) => {
          if (error && !cmd.includes('remote add')) {
            console.error(`Error: ${error.message}`);
            return reject(error);
          }
          output += stdout;
          resolve();
        });
      });
    }

    const repoUrl = `https://github.com/${username}/camera-monitor`;
    const vercelUrl = `https://vercel.com/new?repository-url=${encodeURIComponent(repoUrl)}`;

    res.json({
      success: true,
      repoUrl,
      vercelUrl,
      message: '✅ Código subido a GitHub. Ahora ve a Vercel.'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Abre tu navegador en: http://localhost:${PORT}\n`);
  console.log(`Presiona Ctrl+C para detener\n`);
});
