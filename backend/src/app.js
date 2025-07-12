const fastify = require('fastify');
const fastifyCors = require('@fastify/cors');
const fastifyHelmet = require('@fastify/helmet');
const fastifySensible = require('@fastify/sensible');
const cookie = require('@fastify/cookie');
const multipart = require('@fastify/multipart');

const jwtPlugin = require('./plugins/jwt');
const authRoutes = require('./routes/auth.routes');
const adRoutes = require('./routes/ad.routes');
const env = require('./config/env');
const contactRoutes = require('./routes/contact.routs');
const parse = require('@fastify/formbody')
const userRoutes = require('./routes/user.routes');

function buildApp() {
  const app = fastify({ logger: true });

  app.register(fastifyCors, {
    origin: env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.register(fastifyHelmet);
  app.register(fastifySensible);
  app.register(cookie, { secret: env.COOKIE_SECRET });

  app.register(jwtPlugin);
  app.register(multipart, { limits: { fileSize: 10 * 1024 * 1024 } });

  app.register(adRoutes);
  app.register(parse)
  app.register(contactRoutes);
  app.register(userRoutes,{prefix:'/api/v1'});
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
