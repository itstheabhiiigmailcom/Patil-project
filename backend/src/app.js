const fastify = require('fastify');
const jwtPlugin = require('./plugins/jwt');
const authRoutes = require('./routes/auth.routes');
const fastifyHelmet = require('@fastify/helmet');
const fastifySensible = require('fastify-sensible');
const cookie = require('@fastify/cookie');
const env = require('./config/env');

function buildApp() {
  const app = fastify({ logger: true });

  app.register(fastifyHelmet);
  app.register(fastifySensible);
  app.register(jwtPlugin);

  // ⬇️  THIS must come before any handler that calls reply.setCookie
  app.register(cookie, { secret: env.COOKIE_SECRET });

  app.register(authRoutes);

  app.get('/health', async () => ({ status: 'ok' }));
  return app;
}

module.exports = buildApp;
