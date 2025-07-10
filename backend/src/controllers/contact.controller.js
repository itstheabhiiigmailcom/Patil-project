const nodemailer = require('nodemailer');

async function sendContactMessage(request, reply) {
  const { name, email, message } = request.body;

  if (!name || !email || !message) {
    return reply.badRequest('All fields are required.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'nooneishere860@gmail.com',
      pass: 'tqww vutz pvwe azno',
    },
  });

  const mailOptions = {
    from: email,
    to: 'nooneishere860@gmail.com',
    subject: `New Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    reply.send({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    reply.internalServerError('Failed to send email');
  }
}

module.exports = {
  sendContactMessage,
};
