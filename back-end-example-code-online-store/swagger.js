const fs = require('node:fs');
const path = require('node:path');

const document = {
  openapi: '3.0.3',
  info: {
    title: 'Recruiters Example API',
    version: '1.0.0',
    description: 'Contas ativadas por e-mail, fotos de perfil e comentários.',
  },
  servers: [{ url: '/' }],
  paths: {
    '/': { get: { summary: 'Verifica a rota inicial', responses: { 200: { description: 'API disponível.' } } } },
    '/health': { get: { summary: 'Verifica a API e o MongoDB', responses: { 200: { description: 'Serviço saudável.' }, 503: { description: 'MongoDB indisponível.' } } } },
    '/register': {
      post: {
        summary: 'Cria uma conta e envia o link de ativação',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password', 'name'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8, maxLength: 128 }, name: { type: 'string', maxLength: 100 } } } } } },
        responses: { 201: { description: 'Cadastro criado; ativação enviada.' }, 409: { description: 'E-mail já cadastrado.' }, 422: { description: 'Dados inválidos.' }, 429: { description: 'Limite de cadastros atingido.' } },
      },
    },
    '/login': {
      post: {
        summary: 'Autentica uma conta ativada',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } } },
        responses: { 200: { description: 'JWT Bearer e dados de perfil.' }, 401: { description: 'Credenciais inválidas.' }, 403: { description: 'Conta ainda não ativada.' }, 429: { description: 'Limite de tentativas atingido.' } },
      },
    },
    '/token': {
      post: {
        summary: 'Ativa uma conta com token de uso único',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['token'], properties: { token: { type: 'string' } } } } } },
        responses: { 200: { description: 'Conta ativada.' }, 400: { description: 'Token inválido, expirado ou já utilizado.' } },
      },
    },
    '/uploadPhotoProfile': {
      post: {
        summary: 'Atualiza a foto da conta autenticada',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['fotoPerfil'], properties: { fotoPerfil: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Foto atualizada.' }, 401: { description: 'Token inválido.' }, 413: { description: 'Arquivo maior que 5 MB.' }, 415: { description: 'Imagem inválida.' } },
      },
    },
    '/putProfile': {
      post: {
        summary: 'Atualiza o perfil da conta autenticada',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'nome'], properties: { email: { type: 'string', format: 'email' }, nome: { type: 'string' }, senha: { type: 'string', minLength: 8 } } } } } },
        responses: { 200: { description: 'Perfil atualizado.' }, 401: { description: 'Token inválido.' }, 422: { description: 'Dados inválidos.' } },
      },
    },
    '/comentarios': {
      get: { summary: 'Lista comentários públicos paginados', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } }, { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 50, default: 50 } }], responses: { 200: { description: 'Feed público sem e-mail ou senha.' } } },
      post: { summary: 'Cria um comentário da conta autenticada', security: [{ bearerAuth: [] }], responses: { 201: { description: 'Comentário criado.' }, 401: { description: 'Token inválido.' }, 400: { description: 'Dados inválidos.' } } },
    },
  },
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
};

fs.writeFileSync(path.join(__dirname, 'swagger_output.json'), `${JSON.stringify(document, null, 2)}\n`);
