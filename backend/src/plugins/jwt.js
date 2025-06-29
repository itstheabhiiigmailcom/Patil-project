const fp = require('fastify-plugin');
const env = require('../config/env');

async function jwtPlugin(fastify) {
  fastify.register(require('@fastify/jwt'), {
    secret: env.JWT_SECRET,
    sign: { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
}

module.exports = fp(jwtPlugin);
