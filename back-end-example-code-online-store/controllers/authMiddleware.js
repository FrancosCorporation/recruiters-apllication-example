const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { jwtAudience, jwtIssuer, jwtSecret } = require('../config/env');

module.exports = async (req, res, next) => {
  const authorization = req.get('authorization') ?? '';
  const match = authorization.match(/^Bearer\s+(\S+)$/i);
  if (!match) {
    return res.status(401).json({ status: 401, msg: 'Acesso não autorizado.' });
  }

  try {
    const claims = jwt.verify(match[1], jwtSecret, {
      algorithms: ['HS256'],
      audience: jwtAudience,
      issuer: jwtIssuer,
    });
    if (typeof claims === 'string' || typeof claims.userId !== 'string') {
      return res.status(401).json({ status: 401, msg: 'Acesso não autorizado.' });
    }

    const user = await User.findById(claims.userId).select('verify');
    if (!user?.verify) {
      return res.status(401).json({ status: 401, msg: 'Sessão inválida. Ative sua conta e entre novamente.' });
    }

    req.user = { userId: String(user._id) };
    return next();
  } catch {
    return res.status(401).json({ status: 401, msg: 'Acesso não autorizado.' });
  }
};
