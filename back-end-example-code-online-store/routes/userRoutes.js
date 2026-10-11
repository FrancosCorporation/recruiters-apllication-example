const crypto = require('node:crypto');
const express = require('express');
const { rateLimit } = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const User = require('../models/user');
const Comentario = require('../models/comentario');
const authMiddleware = require('../controllers/authMiddleware');
const uploadPhoto = require('../config/upload_fotos');
const { sendActivationEmail } = require('../controllers/userController');
const config = require('../config/env');

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const acceptedImageTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);
const dummyPasswordHash = bcrypt.hashSync(crypto.randomBytes(32).toString('hex'), 12);

const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { status: 429, msg: 'Muitas tentativas. Aguarde alguns minutos e tente novamente.' },
});
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { status: 429, msg: 'Muitas tentativas de cadastro. Tente novamente mais tarde.' },
});
const activationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { status: 429, msg: 'Muitas tentativas de ativação. Tente novamente mais tarde.' },
});
const photoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => callback(null, acceptedImageTypes.has(file.mimetype)),
});

router.post('/register', registerLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';

  if (!emailPattern.test(email) || email.length > 254 || password.length < 8 || password.length > 128 || !name || name.length > 100) {
    return res.status(422).json({ status: 422, msg: 'Informe nome, e-mail válido e senha entre 8 e 128 caracteres.' });
  }
  if (!config.emailLogin || !config.emailPassword) {
    return res.status(503).json({ status: 503, msg: 'O cadastro por e-mail está temporariamente indisponível.' });
  }

  try {
    if (await User.exists({ email })) {
      return res.status(409).json({ status: 409, msg: 'Usuário já existe.' });
    }

    const user = await User.create({ email, name, password: await bcrypt.hash(password, 12), verify: false });
    try {
      await sendActivationEmail(user);
    } catch (error) {
      await user.deleteOne();
      console.error('Activation email failed:', error?.name ?? 'UnknownError');
      return res.status(503).json({ status: 503, msg: 'Não foi possível enviar o e-mail de ativação. Tente novamente mais tarde.' });
    }

    return res.status(201).json({ status: 201, msg: 'Cadastro criado. Confira seu e-mail para ativar a conta.' });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ status: 409, msg: 'Usuário já existe.' });
    }
    console.error('Registration failed:', error?.name ?? 'UnknownError');
    return res.status(500).json({ status: 500, msg: 'Não foi possível concluir o cadastro.' });
  }
});

router.post('/login', loginLimiter, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  try {
    const user = email ? await User.findOne({ email }).select('+password') : null;
    const validPassword = await bcrypt.compare(password || 'invalid-password', user?.password ?? dummyPasswordHash);
    if (!user || !validPassword) {
      return res.status(401).json({ status: 401, msg: 'Credenciais inválidas.' });
    }
    if (!user.verify) {
      return res.status(403).json({ status: 403, msg: 'Confirme seu e-mail para ativar a conta antes de entrar.' });
    }

    const token = jwt.sign(
      { userId: String(user._id), sub: String(user._id) },
      config.jwtSecret,
      { algorithm: 'HS256', audience: config.jwtAudience, expiresIn: '2h', issuer: config.jwtIssuer },
    );
    const dados = { name: user.name, email: user.email, foto: user.photoUrl };
    return res.status(200).json({ status: 200, token, dados, msg: 'Login realizado com sucesso.' });
  } catch (error) {
    console.error('Login failed:', error?.name ?? 'UnknownError');
    return res.status(500).json({ status: 500, msg: 'Não foi possível fazer login.' });
  }
});

router.post('/uploadPhotoProfile', authMiddleware, photoUpload.single('fotoPerfil'), async (req, res) => {
  if (!req.file) {
    return res.status(415).json({ status: 415, msg: 'Envie uma imagem JPEG, PNG ou WebP de até 5 MB.' });
  }

  try {
    const { fileTypeFromBuffer } = await import('file-type');
    const detectedType = await fileTypeFromBuffer(req.file.buffer);
    if (!detectedType || !acceptedImageTypes.has(detectedType.mime)) {
      return res.status(415).json({ status: 415, msg: 'O conteúdo do arquivo não é uma imagem aceita.' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ status: 404, msg: 'Usuário não encontrado.' });
    }

    user.photoUrl = await uploadPhoto(req.file.buffer);
    await user.save();
    return res.status(200).json({ status: 200, msg: 'Upload da foto de perfil concluído.' });
  } catch (error) {
    if (error?.code === 'CLOUDINARY_NOT_CONFIGURED') {
      return res.status(503).json({ status: 503, msg: 'O serviço de imagens não está configurado.' });
    }
    console.error('Profile photo upload failed:', error?.name ?? 'UnknownError');
    return res.status(502).json({ status: 502, msg: 'Não foi possível salvar a foto de perfil.' });
  }
});

router.post('/putProfile', authMiddleware, async (req, res) => {
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const name = typeof req.body?.nome === 'string' ? req.body.nome.trim() : '';
  const password = typeof req.body?.senha === 'string' ? req.body.senha : '';
  if (!emailPattern.test(email) || email.length > 254 || !name || name.length > 100 || (password && (password.length < 8 || password.length > 128))) {
    return res.status(422).json({ status: 422, msg: 'Informe nome válido, e-mail válido e, se alterar a senha, use 8 a 128 caracteres.' });
  }

  try {
    const user = await User.findById(req.user.userId).select('+password');
    if (!user) {
      return res.status(404).json({ status: 404, msg: 'Usuário não encontrado.' });
    }

    const emailChanged = email !== user.email;
    if (emailChanged && await User.exists({ email, _id: { $ne: user._id } })) {
      return res.status(409).json({ status: 409, msg: 'Este e-mail já está em uso.' });
    }
    if (emailChanged && (!config.emailLogin || !config.emailPassword)) {
      return res.status(503).json({ status: 503, msg: 'A alteração de e-mail está temporariamente indisponível.' });
    }
    if (emailChanged) {
      await sendActivationEmail({ ...user.toObject(), email, name });
    }

    user.name = name;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }
    if (emailChanged) {
      user.verify = false;
    }
    await user.save();

    const dados = { name: user.name, email: user.email, foto: user.photoUrl };
    if (emailChanged) {
      return res.status(200).json({ status: 200, dados, requiresVerification: true, msg: 'Confira o novo e-mail para continuar usando a conta.' });
    }
    return res.status(200).json({ status: 200, dados, msg: 'Perfil atualizado com sucesso.' });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ status: 409, msg: 'Este e-mail já está em uso.' });
    }
    console.error('Profile update failed:', error?.name ?? 'UnknownError');
    return res.status(500).json({ status: 500, msg: 'Não foi possível atualizar o perfil.' });
  }
});

router.post('/token', activationLimiter, async (req, res) => {
  const token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
  if (!token) {
    return res.status(400).json({ status: 400, msg: 'Token de ativação inválido.' });
  }

  let claims;
  try {
    claims = jwt.verify(token, config.jwtSecret, {
      algorithms: ['HS256'],
      audience: config.jwtActivationAudience,
      issuer: config.jwtIssuer,
    });
  } catch {
    return res.status(400).json({ status: 400, msg: 'Token de ativação inválido ou expirado.' });
  }
  if (typeof claims === 'string' || claims.purpose !== 'email_activation' || typeof claims.email !== 'string' || typeof claims.sub !== 'string') {
    return res.status(400).json({ status: 400, msg: 'Token de ativação inválido ou expirado.' });
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: claims.sub, email: claims.email, verify: false },
      { $set: { verify: true } },
      { new: true },
    );
    if (!user) {
      return res.status(400).json({ status: 400, msg: 'Token de ativação inválido, expirado ou já utilizado.' });
    }
    return res.status(200).json({ status: 200, msg: 'Conta ativada. Agora você pode entrar.' });
  } catch (error) {
    console.error('Account activation failed:', error?.name ?? 'UnknownError');
    return res.status(503).json({ status: 503, msg: 'Não foi possível ativar a conta. Tente novamente mais tarde.' });
  }
});

router.post('/comentarios', authMiddleware, async (req, res) => {
  const content = typeof req.body?.conteudo === 'string' ? req.body.conteudo.trim() : '';
  const rawRating = req.body?.avaliacao;
  const rating = typeof rawRating === 'string' ? Number(rawRating.replace(',', '.')) : rawRating;
  if (!content || content.length > 2000) {
    return res.status(400).json({ status: 400, msg: 'O comentário é obrigatório e deve ter até 2000 caracteres.' });
  }
  if (typeof rating !== 'number' || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ status: 400, msg: 'A avaliação deve ser um número entre 1 e 5.' });
  }

  try {
    const userExists = await User.exists({ _id: req.user.userId });
    if (!userExists) {
      return res.status(404).json({ status: 404, msg: 'Usuário não encontrado.' });
    }
    const comentario = await Comentario.create({
      usuario: req.user.userId,
      conteudo: content,
      avaliacao: mongoose.Types.Decimal128.fromString(String(rating)),
    });
    return res.status(201).json({ status: 201, comentario, msg: 'Comentário publicado.' });
  } catch (error) {
    console.error('Comment creation failed:', error?.name ?? 'UnknownError');
    return res.status(500).json({ status: 500, msg: 'Não foi possível publicar o comentário.' });
  }
});

router.get('/comentarios', async (req, res) => {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 50);
  if (!Number.isInteger(page) || page < 1 || page > 10000 || !Number.isInteger(limit) || limit < 1 || limit > 50) {
    return res.status(400).json({ status: 400, msg: 'Use page >= 1 e limit entre 1 e 50.' });
  }

  try {
    const comments = await Comentario.find()
      .sort({ dataCriacao: -1, _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('usuario', 'name photoUrl')
      .lean();
    const feed = comments.filter((comment) => comment.usuario).map((comment) => ({
      nome: comment.usuario.name,
      comentario: comment.conteudo,
      avaliacao: comment.avaliacao.toString(),
      foto: comment.usuario.photoUrl,
    }));
    return res.status(200).json(feed);
  } catch (error) {
    console.error('Comment listing failed:', error?.name ?? 'UnknownError');
    return res.status(500).json({ status: 500, msg: 'Não foi possível carregar os comentários.' });
  }
});

module.exports = (app) => app.use(router);
