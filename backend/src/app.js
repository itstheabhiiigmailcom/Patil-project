const fastify = require('fastify');
const jwtPlugin = require('./plugins/jwt');
const authRoutes = require('./routes/auth.routes');
const fastifyHelmet = require('@fastify/helmet');
const fastifySensible = require('fastify-sensible');
const cookie = require('@fastify/cookie');
const fastifyCors = require('@fastify/cors');
const env = require('./config/env');

function buildApp() {
  const app = fastify({ logger: true });

  app.register(fastifyCors, {
    origin: env.FRONTEND_URL || 'http://localhost:5173', // Your frontend URL (e.g., "http://localhost:3000")
    credentials: true, // Required if using cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  });

  app.register(fastifyHelmet);
  app.register(fastifySensible);
  // ⬇️  THIS must come before any handler that calls reply.setCookie
  app.register(cookie, { secret: env.COOKIE_SECRET });
  app.register(jwtPlugin);

  // Register all routes under /api/v1 prefix
  app.register(
    async (fastify) => {
      fastify.register(authRoutes);
      fastify.get('/health', async () => ({ status: 'ok' }));
    },
    { prefix: '/api/v1' }
  );
  return app;
}

module.exports = buildApp;
