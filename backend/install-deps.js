const { execSync } = require('child_process');
try {
  console.log('Running npm install socket.io in backend...');
  execSync('npm install socket.io', { stdio: 'inherit', cwd: __dirname });
  console.log('Done backend!');
} catch (e) {
  console.error('Backend install failed:', e);
}
