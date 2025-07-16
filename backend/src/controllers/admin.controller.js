const { models } = require('mongoose');
const User = require('../models/user.model');
const AD = require('../models/ad.model');
const { sendMail } = require('../utils/mailer');

async function getAllUser(req, reply) {
  try {
    const user = await User.find().select('-password');
    return reply.send({ users: user });
  } catch (err) {
    req.log.error(err, '[getAllUser] failed to fetch users')
    return reply.internalServerError('Failed to fetch users');
  }
}

async function getUserBymail(req, reply) {
  const { email } = req.query;

  if (!email) {
    return reply.status(400).send({ message: 'Email query is required' });
  }

  try {
    const users = await User.find({ email: { $regex: email, $options: 'i' } }).select('-password');
    reply.send(users);
  } catch (err) {
    reply.status(500).send({ message: 'Server error' });
  }
}
async function updateUser(req, reply) {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return reply.status(404).send({ message: 'User not found' });
    reply.send(user);
  } catch (err) {
    reply.status(500).send({ message: 'Update failed' });
  }
};

// Delete user
async function deleteUser(req, reply) {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    reply.send({ message: 'User deleted' });
  } catch (err) {
    reply.status(500).send({ message: 'Deletion failed' });
  }
};

// Ban user
async function banUser(req, reply) {
  const { id } = req.params;
  const { days } = req.body;

  try {
    const bannedUntil = new Date();
    bannedUntil.setDate(bannedUntil.getDate() + days);

    const user = await User.findByIdAndUpdate(id, {
      ban: {
        isBanned: true,
        bannedUntil,
      },
    }, { new: true });

    reply.send(user);
  } catch (err) {
    reply.status(500).send({ message: 'Ban failed' });
  }
};




async function sendMailToUser(req, reply) {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return reply.code(400).send({ error: 'Missing fields' });
  }

  try {
    await sendMail({
      to,
      subject,
      html: `<p>${message}</p>`, // You can customize with rich HTML
    });

    reply.send({ success: true, message: 'Mail sent successfully' });
  } catch (err) {
    reply.code(500).send({ error: 'Failed to send mail' });
  }
}
async function addCredit(req, reply) {
  const { userId, amount } = req.body;
  if (!userId || !amount) {
    return reply.status(400).send({ message: 'User ID and amount are required' });
  }
  try {
    const user = await User.findById(userId)
    if (!user || user.role !== 'advertiser'){
      return reply.notFound('Advertiser not found');
    }
    user.credit += amount;
    await user.save();
        reply.send({ success: true, message: 'Credit added successfully', credit: user.credit });
  } catch (err) {
    console.error('Error adding credit:', err);
    reply.internalServerError('Failed to add credit');
  }

  }




module.exports = { getAllUser, getUserBymail, updateUser, deleteUser, banUser, sendMailToUser,addCredit };