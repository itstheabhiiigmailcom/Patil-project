const { models } = require('mongoose');
const User = require('../models/user.model');
const Ad = require('../models/ad.model'); // adjust path if needed


async function setAgeHandler(req, reply) {
  try {
    const { age } = req.body;
    const userId = req.userData?._id; // ✅ Ensure this is set from middleware

    if (typeof age !== 'number' || age < 13 || age > 120) {
      return reply.badRequest('Invalid age');
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { age },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return reply.notFound('User not found');
    }

    return reply.send({ success: true, user: updatedUser }); // ✅ This must be called
  } catch (err) {
    req.log.error({ err }, '[setAgeHandler] Failed to update age');
    return reply.internalServerError('Failed to set age');
  }
}

async function getAdsForUserHandler(req, reply) {
  try {
    const { id: userId } = req.params;

    const user = await User.findById(userId).select('age');
    if (!user || typeof user.age !== 'number') {
      return reply.notFound('User not found or age not set');
    }

    const ads = await Ad.find({
      'targetAgeGroup.min': { $lte: user.age },
      'targetAgeGroup.max': { $gte: user.age },
        'feedbacks.userId': { $ne: user._id },
    });

    return reply.send({ ads });
  } catch (err) {
    req.log.error({ err }, 'Error fetching ads');
    return reply.internalServerError('Failed to fetch ads');
  }
}

async function trackViewHandler(req, reply) {
  try {
    const { adId } = req.params;

    const ad = await Ad.findByIdAndUpdate(adId, {
      $inc: { views: 1 },
    });

    if (!ad) return reply.notFound('Ad not found');

    reply.send({ success: true });
  } catch (err) {
    req.log.error({ err }, '[trackViewHandler] Failed to track ad view');
    reply.internalServerError('View tracking failed');
  }
}

async function submitFeedbackHandler(req, reply) {
  try {
    const { adId } = req.params;
    const { comment, sentiment } = req.body;

    if (!['like', 'dislike'].includes(sentiment)) {
      return reply.badRequest('Sentiment must be "like" or "dislike".');
    }

    const feedback = {
      userId: req.userData._id,
      userName: req.userData.name,      // ✅ name from token
      userEmail: req.userData.email,    // ✅ email from token
      comment,
      sentiment,
      createdAt: new Date(),            // ✅ timestamp
    };

    const ad = await Ad.findByIdAndUpdate(
      adId,
      { $push: { feedbacks: feedback } },
      { new: true }
    );

    if (!ad) return reply.notFound('Ad not found.');

    reply.send({ success: true, message: 'Feedback submitted', ad });
  } catch (err) {
    req.log.error({ err }, '[submitFeedbackHandler] Failed to submit feedback');
    reply.internalServerError('Failed to submit feedback');
  }
}

// controllers/ad.controller.js

async function getAdHistoryForUserHandler(req, reply) {
  try {
    const userId = req.params.userId;

    const ads = await Ad.find({ 'feedbacks.userId': userId }).populate(
      'feedbacks.userId',
      'name'
    );

    return reply.send({ ads });
  } catch (err) {
    req.log.error(err, '[getAdHistoryForUserHandler] Failed to fetch ad history');
    return reply.internalServerError('Failed to fetch ad history');
  }
}




module.exports = {setAgeHandler,submitFeedbackHandler,getAdsForUserHandler,trackViewHandler,getAdHistoryForUserHandler};