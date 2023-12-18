const express = require('express')
const router = express.Router()
const User = require('../models/user');
const fs = require('fs');
const multer = require('multer')
const uploadPhoto = require('../config/upload_fotos')
const Comentario = require('../models/comentario');
const authMiddleware = require('../controllers/authMiddleware');
const { criarNovoUsuario, verificarSeEmailExiste, verificarCredenciais, tragaTodosOsDados, sendEmail, gerarToken, } = require('../controllers/userController');
const { verifyTokenValid } = require('../controllers/tokenController');

const meusegredo = process.env.MEUSEGREDO;

// Configuração do multer para o armazenamento temporário da foto
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads'); // Pasta onde os arquivos serão salvos temporariamente
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Nome do arquivo no formato data-nomeOriginal
  }
});

const upload = multer({ storage: storage });


router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // Verifique se todos os campos obrigatórios foram fornecidos
    if (!email || !password || !name) {
      return res.status(422).json({ msg: "Todos os campos obrigatórios devem ser fornecidos", status: 422, text: 'Unprocessable Entity' });
    }
    
    if (await verificarSeEmailExiste(email)) {
      console.log("User try register :", req.body['email'])
      return res.status(409).json({ msg: 'Usuário já existe', status: 409, text: 'Conflict' });
    }
    //registrando o usuario
    if (criarNovoUsuario(email, password, name)) {
      console.log("User Registrado :", req.body['email'])
      sendEmail(email,name)
      res.status(201).json({ msg: 'Usuário registrado com sucesso', status: 201, text: 'Create' });
    }
    else {
      res.status(500).json({ msg: 'Erro interno no servidor', status: 500, text: 'Internal Error' });
    }


  } catch (err) {
    console.log(err, ': ', req.body['email'])
    res.status(500).json({ msg: 'Erro ao registrar usuário', status: 500, text: 'Internal Error' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifique se o usuário existe na base de dados


    const user = await verificarSeEmailExiste(email);

    if (!user) {
      return res.status(401).json({ msg: 'Credenciais inválidas' });
    }


    // Verifique se a senha do usuário foi fornecida
    if (!password) {
      return res.status(401).json({ msg: 'Credenciais inválidas' });
    }


    if (await verificarCredenciais(password, user.password)) {
      // gerando token JWT para o usuário autenticado
      gerarToken(user.id,meusegredo,'2h')
      const dados = {name:user.name , email:user.email, foto:user.photoUrl}
      // Retorne o token JWT para o cliente
      res.status(200).json({ token, dados});
    } else {
      return res.status(401).json({ msg: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ msg: 'Erro ao fazer login' });
  }
});

router.post('/upload_foto_profile', authMiddleware, upload.single('fotoPerfil'), async (req, res) => {

  // Rota para fazer o upload da foto de perfil do usuário
  try {

    if (!req.body.email) {
      return res.status(406).json({ msg: 'Campo email é obrigatório' });
    }

    // Verifique se o usuário existe no banco de dados
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    // Verifique se a foto de perfil foi fornecida na requisição
    if (!req.file) {
      return res.status(400).json({ msg: 'Foto de perfil não fornecida' });
    }

    const tempPath = req.file.path;

    // Enviar a foto para o Cloudinary
    const photoUrl = await uploadPhoto(tempPath);


    // Apagar a foto temporária do servidor para liberar espaço
    fs.unlinkSync(tempPath);

    // Atualizar o campo "photoUrl" no usuário no banco de dados com a URL da foto no Cloudinary
    user.photoUrl = photoUrl;
    await user.save();

    res.json({ message: 'Upload da foto de perfil concluído' });
  } catch (error) {
    console.error('Erro ao fazer o upload da foto:', error);
    res.status(500).json({ msg: 'Erro ao fazer o upload da foto' });
  }
});

router.post('/comentarios', authMiddleware, async (req, res) => {
  try {
    const { conteudo, avaliacao } = req.body;
    var avaliacaoDecimal = "";
    const usuario = req.user.userId; // O usuário autenticado está disponível em req.user
    // Verifique se o conteúdo está presente no corpo da requisição
    if (!conteudo) {
      return res.status(400).json({ msg: 'Campo conteudo é obrigatório.' });
    }

    // Verifique se a avaliação está presente no corpo da requisição
    if (!avaliacao) {
      return res.status(400).json({ msg: 'Campo avaliacao é obrigatório' });
    }
    if (typeof avaliacao == "string") {
      // Converta a vírgula em ponto na avaliação (caso exista)
      avaliacaoDecimal = parseFloat(avaliacao.replace(',', '.'));
      // Verifique se a avaliação é um número válido entre 1 e 5
      if (isNaN(avaliacaoDecimal) || avaliacaoDecimal < 1 || avaliacaoDecimal > 5) {
        return res.status(400).json({ msg: 'Avaliação inválida. A avaliação deve estar entre 1 e 5.' });
      }
    }
    if (typeof avaliacao == "number") {
      if (avaliacao < 1 || avaliacao > 5) {
        return res.status(400).json({ msg: 'Avaliação inválida. A avaliação deve estar entre 1 e 5.' });
      }
    }

    // Crie o novo comentário
    const novoComentario = new Comentario({
      usuario,
      conteudo,
      avaliacao: avaliacaoDecimal == "" ? avaliacao : avaliacaoDecimal // Use a avaliação decimal aqui , verificando se existem valores no avaliacaoDecimal
    });

    // Salve o comentário no banco de dados
    const comentarioSalvo = await novoComentario.save();

    res.status(201).json(comentarioSalvo);
  } catch (error) {
    if (error.message.includes('Unexpected number in JSON')) {
      console.error(error)
      return res.status(400).json({ msg: 'JSON inválido. Verifique a sintaxe dos campos numéricos.' });
    } else {
      // Outros erros não esperados
      console.error(error)
      return res.status(500).json({ msg: 'Erro interno do servidor.' });
    }
  }
});

router.post('/token', async (req, res) => {
  try {
    const { token } = req.body;
    if(verifyTokenValid(token,meusegredo)){
      return res.status(200).json({ msg: 'Ativação da conta foi um sucesso! 🎉' });
    }
    else{
      return res.status(400).json({ msg: 'Token inválido. Entre em contato com o suporte !' });
    }
  } catch (error) {
    return res.status(500).json({ msg: 'Erro interno do servidor.' });
  }
});

// Rota para obter todos os comentários
router.get('/comentarios', async (req, res) => {
  try {
    // Consulte o banco de dados para obter todos os comentários
    const comentarios = await Comentario.find();

    // Crie uma lista para armazenar os comentários com os nomes de usuário
    const comentariosComNomes = [];

    // Para cada comentário, encontre o nome do usuário associado
    for (const comentario of comentarios) {
      const usuario = await User.findById(comentario.usuario); // Supondo que o campo do usuário seja um ID
      if (usuario) {
        const comentarioComNome = {
          nome: usuario.name, // Adicione o nome do usuário ao resultado
          comentario: comentario.conteudo,
          avaliacao: comentario.avaliacao.toString(),
          foto: usuario.photoUrl
        };
        comentariosComNomes.push(comentarioComNome);
      }
    }

    res.status(200).json(comentariosComNomes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: 'Erro interno do servidor.' });
  }
});


module.exports = app => app.use(router)