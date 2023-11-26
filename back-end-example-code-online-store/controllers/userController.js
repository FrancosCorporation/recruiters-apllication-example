const bcrypt = require('bcryptjs');
const User = require('../models/user');


async function criarNovoUsuario(email, password, name) {
  try {
    // Criar um hash da senha usando o bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crie o novo usuário com a senha criptografada
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
    });

    // Salve o usuário no banco de dados
    await newUser.save();
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

async function verificarSeEmailExiste(email) {
  try {
    return await User.findOne({ email }).select('+password');
  } catch (error) {
    console.log(error)
    return null;
  }
}
async function verificarCredenciais(senhaRequest, senhaudb) {
  try {
    // Verifique a senha do usuário
    return await bcrypt.compare(senhaRequest, senhaudb);
  } catch (error) {
    console.log(error)
    return false;
  }
}


async function tragaTodosOsDados(email) {
  try {
    const user = await User.findOne({ email });
    console.log(user)
    return user;

  } catch (error) {
    console.log(error)
    return false;
  }
}
async function sendEmail(email) {
  // Gere um token único
  const token = generateToken();

  // Configure o transporte de e-mail (usando nodemailer, você precisa configurar um serviço de e-mail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host:'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: 'francoscorporationemail@gmail.com',
      pass: '35141543',
    },
  });

  // Construa o e-mail
  const mailOptions = {
    from: 'no-reply@gmail.com',
    to: email,
    subject: 'Confirmação de e-mail',
    html: `<p>Clique no link abaixo para confirmar seu e-mail:</p><a href="http://seu-frontend-rota/${token}">Confirmar E-mail</a>`,
  };

  // Envie o e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('E-mail enviado com sucesso!');
  });

}



module.exports = {
  sendEmail,
  criarNovoUsuario,
  verificarSeEmailExiste,
  verificarCredenciais,
  tragaTodosOsDados,
};