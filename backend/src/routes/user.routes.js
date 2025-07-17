const fp = require('fastify-plugin');
const userController = require('../controllers/user.controller');

async function userRoutes(fastify) {
  fastify.get('/profile', {
    preHandler: [fastify.authenticate],
    handler: userController.getUserProfile,
  });

  fastify.put('/edit-profile', {
    preHandler: [fastify.authenticate],
    handler: userController.updateUserProfile,
  });
}

module.exports = fp(userRoutes); // ✅ THIS IS REQUIRED
