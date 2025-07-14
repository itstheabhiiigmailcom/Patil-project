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




async function updateUserProfile(request, reply) {
  try {
    const userId = request.user?.sub; // ✅ Use sub from JWT
    if (!userId) {
      return reply.unauthorized('User not authenticated');
    }

    const { interests, time } = request.body;

    const user = await User.findById(userId);
    if (!user) return reply.notFound('User not found');

    if (user.role !== 'user') {
      return reply.forbidden('Only regular users can edit their profile');
    }

    // ✅ Allowed values
    const validInterests = [
      'sports', 'music', 'movies', 'travel', 'gaming',
      'reading', 'cooking', 'art', 'technology'
    ];
    const validTimes = ['morning', 'afternoon', 'evening', 'night'];

    // ✅ Validate interests: must be array & valid values
    if (
      interests &&
      (!Array.isArray(interests) || !interests.every((i) => validInterests.includes(i)))
    ) {
      return reply.badRequest('Invalid interests value. Must be an array of valid strings.');
    }

    // ✅ Validate time: must be array & valid values
    if (
      time &&
      (!Array.isArray(time) || !time.every((t) => validTimes.includes(t)))
    ) {
      return reply.badRequest('Invalid time value. Must be an array of valid strings.');
    }

    // ✅ Save to user
    if (interests) user.interests = interests;
    if (time) user.time = time;

    await user.save();

    return reply.send({ message: 'Profile updated successfully', user });
  } catch (err) {
    request.log.error(err, '[updateUserProfile] Error');
    return reply.internalServerError('Failed to update profile');
  }
}

// controllers/user.controller.js
// controllers/user.controller.js
async function getUserProfile(req, reply) {
  try {
    const userId = req.user?.sub;
    if (!userId) return reply.unauthorized('User not authenticated');

    const user = await User.findById(userId).select('name email interests time');

    if (!user) return reply.notFound('User not found');

    reply.send({
      name: user.name,
      email: user.email,
      interests: user.interests || [],
      time: user.time || [],
    });
  } catch (err) {
    req.log.error(err, '[getUserProfile] Error');
    reply.internalServerError('Could not fetch profile');
  }
}







module.exports = {setAgeHandler,submitFeedbackHandler,getAdsForUserHandler,trackViewHandler,getAdHistoryForUserHandler,updateUserProfile,getUserProfile};