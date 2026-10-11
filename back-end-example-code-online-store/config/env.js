require('dotenv').config();

function required(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} must be configured in the environment.`);
  }
  return value;
}

const jwtSecret = required('JWT_SECRET');
if (Buffer.byteLength(jwtSecret, 'utf8') < 32 || /replace_me|changeme|your_secret|example/i.test(jwtSecret)) {
  throw new Error('JWT_SECRET must be generated secret material of at least 32 bytes.');
}

const mongoUri = required('MONGO_URI');
if (!/^mongodb(?:\+srv)?:\/\//i.test(mongoUri)) {
  throw new Error('MONGO_URI must use mongodb:// or mongodb+srv://.');
}

const port = Number(process.env.PORT ?? 3001);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

const emailLogin = process.env.EMAIL_LOGIN?.trim() ?? '';
const emailPassword = process.env.EMAIL_PASSWORD ?? '';
if (Boolean(emailLogin) !== Boolean(emailPassword)) {
  throw new Error('EMAIL_LOGIN and EMAIL_PASSWORD must be configured together.');
}
if (process.env.NODE_ENV === 'production' && (!emailLogin || !emailPassword)) {
  throw new Error('EMAIL_LOGIN and EMAIL_PASSWORD are required in production.');
}
if (emailLogin && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLogin)) {
  throw new Error('EMAIL_LOGIN must be a valid email address.');
}

const appBaseUrl = process.env.APP_BASE_URL?.trim() || 'http://localhost:3212';
let parsedBaseUrl;
try {
  parsedBaseUrl = new URL(appBaseUrl);
} catch {
  throw new Error('APP_BASE_URL must be a valid HTTP(S) URL.');
}
if (!['http:', 'https:'].includes(parsedBaseUrl.protocol) || (process.env.NODE_ENV === 'production' && parsedBaseUrl.protocol !== 'https:')) {
  throw new Error('APP_BASE_URL must use HTTPS in production.');
}

const jwtIssuer = process.env.JWT_ISSUER?.trim() || 'recruiters-apllication-example';
const jwtAudience = process.env.JWT_AUDIENCE?.trim() || 'recruiters-apllication-example';

module.exports = Object.freeze({
  appBaseUrl: parsedBaseUrl.origin,
  cloudinaryKey: process.env.CLOUDINARY_KEY?.trim() ?? '',
  cloudinarySecret: process.env.CLOUDINARY_SECRET ?? '',
  cloudinaryUser: process.env.CLOUDINARY_USER?.trim() ?? '',
  corsOrigins: (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  emailLogin,
  emailPassword,
  host: process.env.HOST?.trim() || '127.0.0.1',
  jwtActivationAudience: `${jwtAudience}:activation`,
  jwtAudience,
  jwtIssuer,
  jwtSecret,
  mongoUri,
  port,
  trustProxy: process.env.TRUST_PROXY === '1' ? 1 : false,
});
