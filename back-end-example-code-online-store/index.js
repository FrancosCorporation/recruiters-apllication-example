require('dotenv').config();
const now = new Date();
const saoPauloTime = now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });// Convert Date.now() to the time in São Paulo's timezone
require('./config/upload_fotos')
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');// Importe a especificação Swagger gerada pelo swagger-autogen
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors');
const port = process.env.PORT;
const baseUrl = process.env.BASEURL;
//const { sendEmail } = require('./controllers/userController');
//const { gerarTokenSimple, verifyTokenValid } = require('./controllers/tokenController');
//const IP = process.env.IP_MACHINE;
//const meusegredo = process.env.MEUSEGREDO;


app.use(cors());

app.listen(port, () => {
  console.log(`Servidor rodando desde a: ${saoPauloTime} no endereço:  ${baseUrl+":"+port}`);
});

app.use(bodyParser.json())
// Habilitar o CORS para todas as rotas
// Middleware para tratar erros de parsing JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    res.status(400).json({ error: 'JSON inválido. Verifique a sintaxe. Existem campos indevidos' });
  } else {
    next();
  }
});


app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json())
require('./routes/userRoutes')(app);
require('./routes/postRoutes')(app);
require('./config/db')(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));


//sendEmail('rodolfofranco14@hotmail.com','rodolfo')



/*const corsOptions = {
  origin: 'http://seusite.com', // Substitua com a origem permitida
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));*/