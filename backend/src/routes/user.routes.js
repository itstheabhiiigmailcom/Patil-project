async function userRoutes(fastify, options) {
    const userController = require('../controllers/user.controller');

    // Update profile route (only for regular users)
    fastify.put('/edit-profile', async (request, reply) => {
        return userController.updateUserProfile(request, reply);
    });
}

module.exports = userRoutes;
