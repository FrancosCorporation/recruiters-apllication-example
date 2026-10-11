# Recruiters Application Example

Exemplo full stack de uma loja online fictícia, com uma API para contas,
ativação de e-mail, perfil, fotos e comentários, e uma interface React.

## Componentes

- `back-end-example-code-online-store`: Node.js 24, Express, MongoDB, JWT,
  bcrypt, envio de e-mail por Gmail/Nodemailer, Cloudinary e Swagger.
- `front-end-example-code-online-store`: React 19 e Vite; login, cadastro,
  ativação da conta, perfil e páginas de exemplo.

As páginas de catálogo ainda são demonstrações e informam quando uma função não
está conectada a uma API.

## Configuração local

Instale Node.js 24 e npm 10 ou superior. Prepare as variáveis dos dois apps:

```bash
cp back-end-example-code-online-store/.env.example back-end-example-code-online-store/.env
cp front-end-example-code-online-store/.env.example front-end-example-code-online-store/.env
openssl rand -hex 32
```

Coloque o valor aleatório em `JWT_SECRET` no `.env` do back-end. Configure
`MONGO_URI` para um MongoDB local ou gerenciado. Para cadastrar contas e enviar
links de ativação, preencha `EMAIL_LOGIN` com a conta Gmail e `EMAIL_PASSWORD`
com uma senha de app dedicada. Defina `APP_BASE_URL` como o endereço do
front-end e `CORS_ORIGINS` com essa origem. Em desenvolvimento, o back-end pode
iniciar sem e-mail, mas o cadastro responderá que o serviço está indisponível
até essas duas variáveis serem configuradas.

O front usa `VITE_HTTPBASE=http://localhost:3211` por padrão local. Instale e
inicie os três diretórios:

```bash
npm ci
npm ci --prefix back-end-example-code-online-store
npm ci --prefix front-end-example-code-online-store
npm start
```

O painel abre em `http://localhost:3212`, a API em `http://localhost:3001` se
iniciada diretamente e a documentação Swagger em `/api-docs`. O comando raiz
inicia API e front juntos; o back-end encerra com erro se MongoDB não estiver
acessível.

## Docker Compose

Depois de configurar o `.env` do back-end conforme acima:

```bash
docker compose up --build -d
```

O front fica em `http://localhost:3212` e a API em `http://localhost:3211`. Os
serviços web são publicados somente no loopback da máquina; o MongoDB usa um
volume persistente e não publica porta no host.

## Variáveis do back-end

| Variável | Obrigatória | Uso |
|---|---|---|
| `JWT_SECRET` | Sim | Segredo aleatório de pelo menos 32 bytes. |
| `MONGO_URI` | Sim | URI MongoDB; no Compose é substituída pela rede interna. |
| `EMAIL_LOGIN` / `EMAIL_PASSWORD` | Produção e cadastro | Conta Gmail e senha de app para enviar ativação. |
| `APP_BASE_URL` | Não | Origem do front usada no link de ativação; produção exige HTTPS. |
| `CORS_ORIGINS` | Não | Lista de origens do navegador separadas por vírgula. |
| `CLOUDINARY_USER`, `CLOUDINARY_KEY`, `CLOUDINARY_SECRET` | Upload | Credenciais Cloudinary; necessárias apenas para fotos. |
| `PORT`, `HOST` | Não | Porta e interface HTTP; padrões `3001` e `127.0.0.1`. |
| `TRUST_PROXY` | Não | Use `1` somente atrás de um proxy confiável. |

O `.env.example` do front só contém `VITE_HTTPBASE`, a URL pública da API. As
variáveis `VITE_*` são incluídas no bundle do navegador; não coloque segredos
nelas.

## Contas e segurança

O cadastro envia um link de ativação com validade de uma hora. O token viaja no
fragmento `#token=` da URL e é enviado ao back-end no corpo de `POST /token`; o
fragmento não é enviado ao servidor web nem em cabeçalhos Referer. A ativação
só pode ser usada uma vez.

O JWT fica em `sessionStorage` durante a sessão do navegador. A antiga
criptografia no cliente foi removida: a chave também era entregue ao navegador
e não protegia o conteúdo. Ao fechar a sessão, entre novamente.

As rotas protegidas usam `Authorization: Bearer <token>`. Upload aceita JPEG,
PNG e WebP até 5 MB e usa somente a identidade do token. O feed público mantém
nome, comentário, avaliação e foto, com paginação de até 50 registros.

## Rotas principais

- `POST /register` e `POST /login`
- `POST /token` para ativar conta
- `POST /uploadPhotoProfile` para atualizar foto
- `POST /putProfile` para atualizar perfil
- `GET /comentarios` e `POST /comentarios`
- `GET /health` e `GET /api-docs`

## Deploy

O front e o back podem ser implantados separadamente na Vercel. Configure a raiz
do projeto para a pasta de cada app. No front, defina `VITE_HTTPBASE` com a URL
pública da API antes do build. No back, configure `JWT_SECRET`, `MONGO_URI`,
`EMAIL_LOGIN`, `EMAIL_PASSWORD`, `APP_BASE_URL` HTTPS, `CORS_ORIGINS` e as
credenciais Cloudinary se necessárias no painel de variáveis do projeto.

## Build, audit e testes

- `npm run build --prefix back-end-example-code-online-store` gera o OpenAPI.
- `npm run build --prefix front-end-example-code-online-store` gera `dist/`.
- `npm audit --prefix back-end-example-code-online-store` e o mesmo comando no front verificam dependências.
- A CI instala ambos os lockfiles, compila os dois apps e roda o audit.

O repositório ainda não tem testes automatizados de integração. Nenhuma suíte
de testes foi executada nesta atualização.

Consulte [SECURITY.md](SECURITY.md) para reportar vulnerabilidades.

## Licença

MIT — consulte [LICENSE](LICENSE).
