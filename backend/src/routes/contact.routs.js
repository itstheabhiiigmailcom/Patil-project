// routes/contact.routes.js
const { sendContactMessage } = require('../controllers/contact.controller');

async function contactRoutes(fastify, options) {
  fastify.post('/api/v1/api/contact', sendContactMessage);
}

module.exports = contactRoutes;
