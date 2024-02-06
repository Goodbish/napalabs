const { exec } = require('child_process');
const os = require('os');

function startBackendServer() {
  exec('node app.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Ошибка при запуске сервера для бэкенда: ${error}`);
      return;
    }
    console.log(`Сервер для бэкенда запущен: ${stdout}`);
  });
}

function startFrontendServer() {
    const command = os.platform() === 'win32' ? 'start' : 'open';
    exec(`cd front && ${command} index.html`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Ошибка при открытии страницы для фронтенда: ${error}`);
        return;
      }
      console.log(`Страница для фронтенда открыта: ${stdout}`);
    });
  }

startBackendServer();

setTimeout(() => {
  startFrontendServer();
}, 2000);