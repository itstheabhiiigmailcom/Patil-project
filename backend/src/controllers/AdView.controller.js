// controllers/adView.controller.js
const Ad = require('../models/ad.model');
const AdViewLog = require('../models/AdView.model');

async function logAdView(req, reply) {
  const { adId } = req.body;

  const userId = req.user?.sub || null; // ✅ Fix: use `.sub` from JWT
  const ip = req.ip;

  console.log('Logging view:', { adId, userId, ip }); // ✅ Debug log

  // Check if recently viewed (30 mins window)
  const recentView = await AdViewLog.findOne({
    adId,
    $or: [
      { userId: userId || null },
      { ip },
    ],
    viewedAt: { $gt: new Date(Date.now() - 30 * 60 * 1000) },
  });

  if (recentView) {
    return reply.send({ counted: false, message: 'Already viewed recently' });
  }

  // Record the view
  const view = await AdViewLog.create({ adId, userId, ip });
  console.log('✅ View saved:', view); // Optional: verify saved record

  // Increment views on Ad
  await Ad.findByIdAndUpdate(adId, { $inc: { views: 1 } });

  return reply.send({ counted: true, message: 'View recorded' });
}

module.exports = { logAdView };
