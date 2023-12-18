const bcrypt = require('bcryptjs');
const User = require('../models/user');
var nodemailer = require('nodemailer');
const { gerarTokenSimple } = require('./tokenController');
const meusegredo = process.env.MEUSEGREDO;
const emaillogin = process.env.EMAIL;
const passwordlogin = process.env.PASSWORD;
const baseUrl = process.env.BASEURL;


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
async function verificarCredenciais(senhaRequest, senhadb) {
  try {
    // Verifique a senha do usuário
    return await bcrypt.compare(senhaRequest, senhadb);
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



async function sendEmail(email, name) {



  // Gere um token único
  const token = gerarTokenSimple(meusegredo)

  // Configure o transporte de e-mail (usando nodemailer, você precisa configurar um serviço de e-mail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    //host: 'smtp.gmail.com',
    port: 587,
    //port: 465,
    auth: {
      user: emaillogin,  // Substitua pelo seu nome de usuário
      pass: passwordlogin,  // Substitua pela sua senha
    },
  });

  // Construa o e-mail
  const mailOptions = {
    from: 'no-reply@gmail.com',
    to: email,
    subject: 'Ativação de conta',
    html: `<p>Olá ${name}, clique no link abaixo para confirmar seu e-mail:</p><a href="${baseUrl}/token?token=${token}">Confirmar E-mail</a>`,
  };


  // An array of attachments
  // attachments: [
  //   {
  //     filename: 'text notes.txt',
  //     path: 'notes.txt'
  //   },
  //]

  // Envie o e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      console.log('erro na hora de enviar o email')
    }
    else {
      console.log('E-mail enviado com sucesso!');
    }
  });

}





module.exports = {
  sendEmail,
  criarNovoUsuario,
  verificarSeEmailExiste,
  verificarCredenciais,
  tragaTodosOsDados,
};