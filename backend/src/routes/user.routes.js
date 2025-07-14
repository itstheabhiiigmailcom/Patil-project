async function userRoutes(fastify, options) {
    const userController = require('../controllers/user.controller');

    // Update profile route (only for regular users)
    fastify.put('/edit-profile', { preHandler: [fastify.authenticate] }, async (request, reply) => {
        return userController.updateUserProfile(request, reply);
    });
    fastify.get('/profile', {
        preHandler: [fastify.authenticate],
    }, async (request, reply) => {
        return userController.getUserProfile(request, reply);
    });
}
module.exports = userRoutes;
