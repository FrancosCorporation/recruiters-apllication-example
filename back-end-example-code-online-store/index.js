const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');
const { rateLimit } = require('express-rate-limit');
const config = require('./config/env');
const connectToDatabase = require('./config/db');
const swaggerDocument = require('./swagger_output.json');

const app = express();
app.set('trust proxy', config.trustProxy);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      scriptSrcAttr: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || config.corsOrigins.includes(origin)),
  credentials: false,
  optionsSuccessStatus: 204,
}));
app.use(rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: (req) => req.path === '/health',
}));
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));

app.get('/health', async (req, res) => {
  try {
    await connectToDatabase();
    return res.status(200).json({ status: 'ok' });
  } catch {
    return res.status(503).json({ status: 'unavailable' });
  }
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    return next();
  } catch (error) {
    console.error('MongoDB unavailable:', error?.name ?? 'UnknownError');
    return res.status(503).json({ status: 503, msg: 'Serviço temporariamente indisponível.' });
  }
});

require('./routes/userRoutes')(app);
require('./routes/postRoutes')(app);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ status, msg: status === 413 ? 'A imagem excede 5 MB.' : 'Upload inválido.' });
  }
  if (error?.type === 'entity.too.large') {
    return res.status(413).json({ status: 413, msg: 'A requisição excede 100 KB.' });
  }
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ status: 400, msg: 'JSON inválido.' });
  }

  console.error('Request failed:', error?.name ?? 'UnknownError');
  return res.status(500).json({ status: 500, msg: 'Erro interno do servidor.' });
});

async function startServer() {
  await connectToDatabase();
  const server = app.listen(config.port, config.host, () => {
    console.info(`API disponível na porta ${config.port}.`);
  });
  server.on('error', (error) => {
    console.error('HTTP server failed:', error?.code ?? error?.name ?? 'UnknownError');
    process.exitCode = 1;
    void mongoose.disconnect();
  });

  const shutdown = (signal) => {
    console.info(`Encerrando API (${signal}).`);
    const timeout = setTimeout(() => server.closeAllConnections(), 10_000);
    timeout.unref();
    server.close((error) => {
      clearTimeout(timeout);
      mongoose.disconnect().catch(() => {});
      if (error) {
        process.exitCode = 1;
      }
    });
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  return server;
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('API startup failed; verify environment and MongoDB connectivity:', error?.name ?? 'UnknownError');
    process.exitCode = 1;
  });
}

module.exports = app;
