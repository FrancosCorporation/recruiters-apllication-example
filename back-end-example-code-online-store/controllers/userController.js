const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const config = require('../config/env');

const transporter = config.emailLogin
  ? nodemailer.createTransport({
    service: 'gmail',
    auth: { user: config.emailLogin, pass: config.emailPassword },
  })
  : null;

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

async function sendActivationEmail(user) {
  if (!transporter) {
    const error = new Error('Activation email is not configured.');
    error.code = 'EMAIL_NOT_CONFIGURED';
    throw error;
  }

  const token = jwt.sign(
    { email: user.email, purpose: 'email_activation' },
    config.jwtSecret,
    {
      algorithm: 'HS256',
      audience: config.jwtActivationAudience,
      expiresIn: '1h',
      issuer: config.jwtIssuer,
      jwtid: crypto.randomUUID(),
      subject: String(user._id),
    },
  );
  const activationUrl = `${config.appBaseUrl}/token#token=${encodeURIComponent(token)}`;
  const safeName = escapeHtml(user.name);

  await transporter.sendMail({
    from: config.emailLogin,
    to: user.email,
    subject: 'Ative sua conta',
    text: `Olá ${user.name}, confirme seu e-mail neste link: ${activationUrl}`,
    html: `<p>Olá ${safeName}, confirme seu e-mail para ativar sua conta.</p><p><a href="${activationUrl}">Ativar conta</a></p><p>O link expira em uma hora.</p>`,
  });
}

module.exports = { sendActivationEmail };
