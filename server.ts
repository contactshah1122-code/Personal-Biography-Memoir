import express from 'express';
import { spawn, ChildProcess } from 'child_process';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const FLASK_PORT = 5001;

let flaskProcess: ChildProcess | null = null;

function startFlask() {
  console.log('[Server] Launching Python Flask Digital Life Archive on port', FLASK_PORT);
  flaskProcess = spawn('python3', ['app.py'], {
    env: {
      ...process.env,
      PORT: String(FLASK_PORT),
      FLASK_DEBUG: '0',
    },
    cwd: __dirname,
    stdio: 'inherit',
  });

  flaskProcess.on('error', (err) => {
    console.error('[Flask Error]:', err);
  });

  flaskProcess.on('exit', (code, signal) => {
    console.log(`[Flask Exit] exited with code ${code}, signal ${signal}. Restarting in 2s...`);
    setTimeout(startFlask, 2000);
  });
}

// Start the Flask backend process
startFlask();

// Clean up child process upon shutdown
process.on('SIGINT', () => {
  if (flaskProcess) flaskProcess.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  if (flaskProcess) flaskProcess.kill();
  process.exit();
});

// Proxy all requests directly to Flask application
app.use(
  createProxyMiddleware({
    target: `http://127.0.0.1:${FLASK_PORT}`,
    changeOrigin: true,
    ws: false,
    on: {
      error: (err: Error, _req: any, res: any) => {
        console.warn('[Proxy Warning] Flask is initializing, retry in a moment...', err.message);
        if (res && !res.headersSent && typeof res.status === 'function') {
          res.status(503).send(`
            <!DOCTYPE html>
            <html>
              <head><title>Initializing Digital Life Archive</title><meta http-equiv="refresh" content="2"></head>
              <body style="font-family: Georgia, serif; background: #FAF7F2; color: #1C1917; text-align: center; padding-top: 15vh;">
                <h1 style="font-size: 2rem;">Digital Life Archive</h1>
                <p style="color: #78716C; margin-top: 1rem;">Binding database records and starting Flask engine...</p>
                <p style="font-size: 0.85rem; color: #A8A29E;">Refreshing automatically...</p>
              </body>
            </html>
          `);
        }
      },
    },
  })
);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Server] Digital Life Archive gateway listening on http://0.0.0.0:${PORT}`);
});
