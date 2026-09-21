# recruiters-apllication-example

Aplicação de exemplo full stack (loja online fictícia) com back-end Node.js/Express/MongoDB e front-end React, criada em novembro de 2023 para demonstrar práticas de autenticação, segurança, upload de imagens e documentação de API.

![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-green)
![Status](https://img.shields.io/badge/status-exemplo%20de%20portf%C3%B3lio-blue)

## Sobre

Monorepo com dois projetos independentes que conversam entre si:

- `back-end-example-code-online-store` — API REST com cadastro/login de usuários, senhas com bcrypt, tokens JWT, confirmação de conta por e-mail, upload de foto no Cloudinary, comentários e Swagger;
- `front-end-example-code-online-store` — SPA em React com telas de login, cadastro, confirmação de token, perfil, menu lateral e itens gerais/pessoais, consumindo a API com `fetch` e guardando dados criptografados no navegador.

O nome "empresa-do-ben" aparece na base MongoDB: é um cenário fictício de loja.

Deploy de referência (Vercel):

- Front-end: https://recruiters-apllication-example.vercel.app/
- Back-end: https://recruiters-apllication-example-backend.vercel.app/

## Funcionalidades

Comprovadas pelo código:

- **Back-end**
  - `GET /` — resposta de sanidade (`{ "home": "home" }`);
  - `POST /register` — valida campos, verifica e-mail duplicado e cria usuário com hash bcrypt (`routes/userRoutes.js`, `controllers/userController.js`);
  - `POST /login` — valida credenciais e emite JWT com validade de 2h (`routes/userRoutes.js`);
  - Middleware de autenticação por `Authorization: Bearer <token>` (`controllers/authMiddleware.js`);
  - Confirmação de conta por e-mail com token JWT (`sendEmail` em `controllers/userController.js` — chamada comentada nas rotas);
  - Upload de imagens para o Cloudinary (`config/upload_fotos.js` com `multer`);
  - Modelo de comentários com nota de 1 a 5 (`models/comentario.js`);
  - Documentação Swagger servida em `/api-docs` (`swagger_output.json` gerado com `swagger-autogen`);
  - CORS habilitado para todas as rotas.
- **Front-end**
  - Rotas com React Router: Home, Login, Cadastro, Confirmar Token, Itens Gerais, Itens Pessoais e Perfil (`src/App.js`);
  - Criptografia AES no cliente com `crypto-js` antes de gravar dados no navegador (`src/pages/functions/security.js`);
  - Requisições HTTP padronizadas com suporte a token Bearer (`src/pages/functions/https-request.js`);
  - Interface com MUI, Bootstrap e styled-components; carrossel com `react-slick`; validação com `validator`.

## Stack

- **Back-end:** Node.js, Express 4, MongoDB + Mongoose 7, bcryptjs, jsonwebtoken, Cloudinary, Multer, Nodemailer, Swagger (swagger-autogen + swagger-ui-express), dotenv, CORS
- **Front-end:** React 18 (Create React App 5), React Router 6, MUI 5, Bootstrap 5, styled-components, crypto-js, react-slick, validator

## Como rodar

Pré-requisitos do autor: Node.js v20.9.0 e NPM v10.1.0.

### Back-end

```bash
cd back-end-example-code-online-store
npm install
cp .env.example .env   # preencha as variáveis (ver abaixo)
npm start              # nodemon index.js — porta definida em PORT
```

Variáveis do back-end (`.env.example` na pasta): `DB_USER`, `DB_PASSWORD`, `DB_NAME` (MongoDB Atlas/local), `MEUSEGREDO` (segredo JWT), `EMAIL`, `PASSWORD` (conta de envio Gmail), `MAILERSEND_API_KEY`, `BASEURL`, `PORT`, `CLOUDINARY_USER`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET`.

### Front-end

```bash
cd front-end-example-code-online-store
npm install
cp .env.example .env   # REACT_APP_HTTPBASE e REACT_APP_SECRET_KEY
npm start              # http://localhost:3000
```

### Tudo junto (raiz do repositório)

O `package.json` da raiz sobe os dois processos em paralelo:

```bash
npm start
```

No Linux, garanta permissão de leitura/escrita nas pastas do projeto antes de rodar.

## Estrutura do projeto

```
.
├── back-end-example-code-online-store/
│   ├── config/               # conexão Mongo + upload Cloudinary
│   ├── controllers/          # authMiddleware, tokenController, userController
│   ├── models/               # user, comentario
│   ├── routes/               # userRoutes, postRoutes
│   ├── index.js              # Express, CORS, Swagger, listen
│   ├── swagger.js            # gerador da documentação
│   └── vercel.json           # configuração de deploy
├── front-end-example-code-online-store/
│   ├── public/
│   └── src/
│       ├── pages/            # telas, funções e CSS por página
│       ├── images/ + fonts/
│       └── App.js
└── package.json              # script que roda os dois projetos
```

## Observações

- `controllers/funcoesinuteis.js` está vazio (nome mantido do estudo); inofensivo, mas pode ser removido em uma limpeza futura.
- O envio de e-mail está implementado no `userController`, porém a chamada está comentada em `routes/userRoutes.js` — para testar o fluxo completo de confirmação, reative-a.
- Existem trechos comentados em `index.js` com configurações pessoais de desenvolvimento; revise-os antes de publicar/forquear o projeto.
- O `swagger_output.json` aponta `host: localhost:3000`; regenere com `swagger.js` se a porta mudar.

## Licença

MIT — veja [LICENSE](LICENSE).

## Autor

Rodolfo Franco — [github.com/FrancosCorporation](https://github.com/FrancosCorporation)
