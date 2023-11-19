const mongoose = require('mongoose');
const express = require('express')
const router = express.Router()
const password = process.env.DB_PASSWORD;
const user = process.env.DB_USER;
const dbname = process.env.DB_NAME;

function connect() {
mongoose.connect(`mongodb+srv://${user}:${password}@${dbname}.kivfa4t.mongodb.net/empresa-do-ben`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));
}
connect()

module.exports = app => app.use(router)
