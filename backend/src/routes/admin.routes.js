const {
  getAllUser,
  getUserBymail,
  updateUser,
  deleteUser,
  banUser,
  sendMailToUser,
  addCredit,
  getAllAdsAnalytics,
  unbanUser,
} = require('../controllers/admin.controller');
const fp = require('fastify-plugin');
async function adminRoutes(fastify) {
  fastify.get('/admin/users', getAllUser);
  fastify.get('/admin/users/search', getUserBymail);
  fastify.put('/admin/users/:id', updateUser);
  fastify.delete('/admin/users/:id', deleteUser);
  fastify.put('/admin/users/:id/ban', banUser);
  fastify.post('/admin/mail', sendMailToUser);
  fastify.post('/admin/credit', addCredit);
  fastify.get('/admin/ads/analytics', getAllAdsAnalytics);
  fastify.put('/admin/users/:id/unban', unbanUser);
}

module.exports = fp(adminRoutes);
