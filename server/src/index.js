const dns = require('dns');

// Node.js가 127.0.0.1(로컬) DNS를 쓰는 환경에서 mongodb+srv SRV 조회 실패 방지
dns.setServers(['8.8.8.8', '8.8.4.4']);

if (typeof dns.setDefaultResultOrder === 'function') {
  dns.setDefaultResultOrder('ipv4first');
}

const { serverEnvPath, clientEnvPath } = require('./config/loadEnv');

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const assertAuthEnv = () => {
  const missing = [];

  if (!process.env.JWT_SECRET?.trim()) missing.push('JWT_SECRET');
  if (!process.env.REFRESH_JWT_SECRET?.trim()) missing.push('REFRESH_JWT_SECRET');

  if (missing.length > 0) {
    throw new Error(
      `${missing.join(', ')} is not defined. `
      + `Check ${serverEnvPath} or ${clientEnvPath}`,
    );
  }
};

const startServer = async () => {
  try {
    assertAuthEnv();
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};
startServer();
