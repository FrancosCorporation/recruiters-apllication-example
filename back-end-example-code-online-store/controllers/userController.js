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

module.exports = {
  criarNovoUsuario,
  verificarSeEmailExiste,
  verificarCredenciais,
  tragaTodosOsDados,
};