# MELHORIAS — recruiters-apllication-example

> **Gerado por análise de código em 2026-10-02** · Stack: Node + Express + Mongoose + JWT + BCrypt + multer/Cloudinary + React (front)
> 2 apps no mesmo repo (back-end + front-end) · 2.018 LOC · 0 testes no back · sem CI
>
> **Este arquivo é um plano de execução.** Cada item tem ID, `arquivo:linha`, mudança exata,
> critério de aceite e comando de verificação.

---

## 0. Como usar este documento

1. Execute na ordem **P0 → P1 → P2 → P3**, respeitando as ondas da §8.
2. Ao terminar um item: marque `- [x]`, rode o **Verificação**, comite `fix(<ID>): descrição`.
3. **Paths neste documento** são relativos a `back-end-example-code-online-store/` (o back) — o front
   fica em `../front-end-example-code-online-store/`. Itens do front estão marcados.
4. **Este projeto é parente do `Db_Mongo_Empresa_Completo`** (mesmo `uploadPhotoProfile` com
   `req.body.email`, mesmo `cors()` aberto). As correções devem ser **as mesmas** nos dois.
5. **Idioma:** português.

---

## 1. Diagnóstico executivo

App de recrutamento: cadastro/login, upload de foto de perfil (Cloudinary), comentários com avaliação
e perfil. Back-end Express + front React no mesmo repositório.

**O que está bom (não reaça):**

| Item | Evidência |
|---|---|
| Senha com **BCrypt custo 10** | `controllers/userController.js:15` |
| Token de ativação com **24 h** e expiração | `userController.js:87` (`gerarTokenWithExpireddataAndData`) |
| Resposta de login **uniforme** | `userRoutes.js` (login) |
| Rotas sensíveis com `authMiddleware` | `userRoutes.js:98,139,163` |
| Middleware de erro de JSON **antes** das rotas | `index.js:28-34` |
| Front separado do back no mesmo repo | organização clara |

**O que está quebrado:**

1. **`app.listen()` ANTES dos middlewares e das rotas** (`index.js:21` vs `:25,37,39-41`) — a
   aplicação **começa a escutar** antes de ter rotas registradas.
2. **IDOR no upload** (`userRoutes.js:104`): `User.findOne({ email: req.body.email })` ignora
   `req.user` — igual ao `Db_Mongo_Empresa_Completo`.
3. `cors()` aberto (`index.js:19`).

---

## 2. Tabela de prioridades

| ID | Título | Sev | Arquivo | Depende de |
|---|---|---|---|---|
| BUG-00 | `app.listen()` antes de middlewares/rotas | **P0** | `index.js:21` | — |
| SEC-01 | IDOR: upload troca a foto de qualquer usuário | **P0** | `userRoutes.js:104` | — |
| SEC-02 | `cors()` aberto (qualquer origem) | **P1** | `index.js:19` | — |
| SEC-03 | Upload sem limite de tamanho/tipo; nome do cliente | **P1** | `userRoutes.js` | — |
| SEC-04 | Token de ativação em **query string** | **P1** | `userController.js:106` | — |
| SEC-05 | Credenciais de e-mail via env sem validação | **P1** | `userController.js:96-97` | — |
| SEC-06 | Sem rate limit em login/register | **P1** | `userRoutes.js:19,50` | — |
| BUG-01 | `fs.unlinkSync` sem tratamento (arquivo fica) | **P2** | `userRoutes.js:121` | — |
| BUG-02 | `bodyParser.json()` duplicado com `express.json()` | **P2** | `index.js:25,38` | — |
| BUG-03 | `swagger_output.json` importado (pode não existir) | **P2** | `index.js:6` | — |
| IMP-01 | Sem `helmet`/headers de segurança | **P2** | `index.js` | — |
| IMP-02 | Sem `PORT` validado / sem shutdown gracioso | **P2** | `index.js:21` | — |
| IMP-03 | Front: `https-request.js` (chamada manual) sem tratamento de erro | **P2** | front | — |
| TEST-01 | Zero testes no back (IDOR não detectável) | **P1** | *(ausente)* | SEC-01 |
| DEVOPS-01 | Sem CI | **P2** | *(ausente)* | — |
| DEVOPS-02 | Sem `.env.example` | **P2** | *(ausente)* | — |
| DOC-01 | README não cobre 2 apps no mesmo repo | **P3** | `README.md` | — |
| DOC-02 | Falta `SECURITY.md` | **P3** | *(ausente)* | SEC-01 |

**Placar: 2 P0 · 5 P1 · 8 P2 · 2 P3 = 17 itens.**

---

## 3. Segurança

### BUG-00 · `app.listen()` antes de middlewares e rotas · [P0]

- **Arquivo:** `index.js:19-42`
- **Evidência:** a ordem no arquivo é:
  ```javascript
  app.use(cors());                    // linha 19
  app.listen(port, () => { ... });    // linha 21  <-- ESCUTA AQUI
  app.use(bodyParser.json())          // linha 25
  app.use((err, req, res, next) => ...) // linha 28
  app.use(bodyParser.urlencoded(...)) // linha 37
  app.use(express.json())             // linha 38
  require('./routes/userRoutes')(app) // linha 39
  require('./routes/postRoutes')(app) // linha 40
  require('./config/db')(app)         // line 41
  ```
  O `listen` está na **linha 21**, antes de tudo.
- **Impacto:** (a) é uma **race condition no boot** — o Node começa a aceitar conexões imediatamente;
  requisições que chegam nesse intervalo caem no Express **sem** `bodyParser` e **sem** rotas
  → `404` (ou `Cannot read property` de body indefinido); (b) numa janela de restart/deploy, a API
  aceita tráfego e devolve erro em vez de recusar/aguardar; (c) é bug de **ordem de registro** —
 ，容易 fácil de corrigir ignorado.
- **Mudança:** (1) mover `app.listen()` para o **fim** do arquivo, depois de todas as rotas:
  ```javascript
  // ... cors, bodyParser, errorHandler, rotas, db, swagger ...
  app.listen(port, () => console.log(...));
  ```
  (2) envolver em `if (require.main === module)` se o arquivo for importado em teste; (3) ligar no
  banco **antes** de escutar (ver `BUG` de db no gêmeo).
- **Aceite:** nenhuma requisição chega antes das rotas; `curl` imediatamente após o boot responde `200`/`404` de rota (nunca erro de body indefinido).
- **Verificação:**
  ```bash
  npm start & sleep 0.2; curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:3000/login \
    -H 'Content-Type: application/json' -d '{"email":"a@a.com","password":"x"}'   # 401/422, nao 404 por falta de rota
  ```

### SEC-01 · IDOR: upload troca a foto de qualquer usuário · [P0]

- **Arquivo:** `routes/userRoutes.js:98-135`
- **Evidência:**
  ```javascript
  router.post('/uploadPhotoProfile', authMiddleware, upload.single('fotoPerfil'), async (req, res) => {
    if (!req.body.email) { return res.status(406)...; }
    const user = await User.findOne({ email: req.body.email });   // <-- linha 104
    ...
    user.photoUrl = photoUrl; await user.save();
  ```
  A rota tem `authMiddleware` (exige token), mas **ignora `req.user`** e busca o alvo pelo `email`
  do **corpo**. Idêntico ao `SEC-01` do `Db_Mongo_Empresa_Completo`.
- **Impacto:** qualquer autenticado troca a foto de perfil de **qualquer conta** — vandalismo de
  identidade. Num app de recrutamento, trocar a foto de um candidato é dano **reputacional** direto.
- **Mudança:** (1) usar `req.user.userId` (a identidade do token) e **remover** o campo `email` do
  body; (2) se o front enviar `email`, **comparar** com o do token e recusar divergência.
- **Aceite:** token de A + `email` de B → `403`/`404`, foto de B **não** muda.
- **Verificação:**
  ```bash
  curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:3000/uploadPhotoProfile \
    -H "Authorization: Bearer $TOKEN_A" -F 'email=vitima@x.com' -F 'fotoPerfil=@/tmp/foto.png'
  # esperado 403/404 (hoje: 200 e troca a foto da vítima)
  ```

### SEC-02 · `cors()` aberto · [P1]

- **Arquivo:** `index.js:19`
- **Evidência:** `app.use(cors());` — sem opções = `Access-Control-Allow-Origin: *`.
- **Impacto:** qualquer site chama a API. Combinado com `GET /comentarios` (rota pública no gêmeo),
  **vaza** dados sem token. O comentário em `index.js:49-56` mostra que o autor **sabe** do problema e
  deixou a configuração correta **comentada**.
- **Mudança:** usar a configuração que já está comentada (`index.js:49-56`), com a origem em env.
- **Aceite:** origem de fora não recebe header CORS.
- **Verificação:**
  ```bash
  curl -sI http://localhost:3000/ -H 'Origin: https://evil.example' \
    | grep -i 'access-control-allow-origin'   # ausente
  ```

### SEC-03 · Upload sem limite de tamanho/tipo; nome do cliente · [P1]

- **Arquivo:** `routes/userRoutes.js:98` (o `upload.single` — storage definido no controller/config)
- **Evidência:** `multer` configurado **sem** `limits.fileSize` e **sem** `fileFilter` (mesmo padrão do
  gêmeo); o `tempPath` é apagado só no sucesso (`userRoutes.js:121`).
- **Impacto:** **DoS de disco** (arquivo gigante até encher); qualquer tipo aceito (inclusive `.html`,
  que o Cloudinary serve) e vira **URL pública**; arquivo fica em disco se o upload falhar.
- **Mudança:** (1) `limits: { fileSize: 5 * 1024 * 1024 }`; (2) `fileFilter` só `image/jpeg|png|webp`,
  validando **magic bytes**; (3) nome gerado pelo servidor (`crypto.randomUUID()`), não
  `file.originalname`; (4) `finally { unlink }`.
- **Aceite:** > 5 MB ou tipo inválido → `4xx`; nada fica em disco.
- **Verificação:**
  ```bash
  head -c 20000000 /dev/urandom > /tmp/big.bin
  curl -s -o /dev/null -w '%{http_code}\n' -X POST http://localhost:3000/uploadPhotoProfile \
    -H "Authorization: Bearer $TOKEN" -F 'email=meu@x.com' -F 'fotoPerfil=@/tmp/big.bin'   # 4xx
  ```

### SEC-04 · Token de ativação em query string · [P1]

- **Arquivo:** `controllers/userController.js:106`
- **Evidência:**
  ```javascript
  html: `...<a href="${baseUrl}/token?token=${token}">Confirmar E-mail</a>`
  ```
  O token de ativação vai na **URL**, e a rota que o consome é `POST /token` com `token` no body
  (`userRoutes.js:214`).
- **Impacto:** token em URL vaza para: histórico do navegador, **log de servidor** (o `console.log` de
  boot mostra a URL base), `Referer` ao navegar, e o **cliente de e-mail** do destinatário. Token em
  query é uma prática que evita há anos.
- **Mudança:** (1) mandar o token no **corpo** do POST (ou como fragmento `#`, que não vai ao
  servidor nem no `Referer`) — o front já tem a rota; (2) **invalidar após uso** (single-use);
  (3) encurtar a validade (24 h → 1 h para ativação).
- **Aceite:** o e-mail não contém token em query; token usado não funciona de novo.
- **Verificação:**
  ```bash
  grep -n 'token=' controllers/userController.js && echo 'ainda em query' || echo OK
  ```

### SEC-05 · Credenciais de e-mail via env sem validação · [P1]

- **Arquivo:** `controllers/userController.js:96-97`
- **Evidência:** `auth: { user: emaillogin, pass: passwordlogin }` (de `process.env`), com o
  comentário "Substitua pelo seu nome de usuário". A **caixa de Gmail** é a conta de envio.
- **Impacto:** (a) sem validação, sem a variável o envio **falha em runtime** (não no boot); (b) a
  senha da caixa de e-mail fica no env de produção — se o env vazar, a conta de e-mail cai junto
  (e pode estar associada a outros serviços); (c) um único transporter é criado por envio (linha 90).
- **Mudança:** (1) validar as variáveis no boot (falha alto); (2) **usar senha de app** dedicada do
  Gmail, não a senha da conta; (3) mover o transporter para fora da função (singleton), criado uma
  vez; (4) `from` igual ao `user` configurado (hoje `no-reply@gmail.com`, que pode cair no spam).
- **Aceite:** sem `EMAIL_LOGIN`/`PASSWORD` o processo não sobe; transporter criado uma vez.
- **Verificação:**
  ```bash
  unset EMAIL_LOGIN; npm start 2>&1 | grep -i 'email'   # falha alto
  ```

### SEC-06 · Sem rate limit em login/register · [P1]

- **Arquivo:** `routes/userRoutes.js:19` (`/register`), `:50` (`/login`)
- **Evidência:** nenhuma proteção; sem suíte de teste no back.
- **Impacto:** brute-force + enumeração de e-mail (o `/register` devolve "usuário já existe") + flood
  de cadastro.
- **Mudança:** `express-rate-limit` — 5/5 min por IP+e-mail no login, 10/hora no register.
- **Aceite:** 6ª tentativa → `429`.
- **Verificação:**
  ```bash
  for i in $(seq 1 7); do
    curl -s -o /dev/null -w "%{http_code} " -X POST http://localhost:3000/login \
      -H 'Content-Type: application/json' -d '{"email":"a@a.com","password":"errada"}'
  done; echo   # 401s e depois 429
  ```

---

## 4. Bugs e defeitos funcionais

### BUG-01 · `fs.unlinkSync` sem tratamento · [P2]

- **Arquivo:** `routes/userRoutes.js:121`
- **Evidência:** o temp é apagado só **depois** do `uploadPhoto` ter sucesso (linha 119); o `catch`
  (linha 129) **não** apaga.
- **Impacto:** falha do Cloudinary deixa o arquivo em `uploads/` para sempre — DoS de disco por repetição.
- **Mudança:** `try { ... } finally { if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath); }`.
- **Aceite:** upload falho não deixa arquivo.
- **Verificação:**
  ```bash
  ls uploads/ | wc -l   # igual antes e depois de um upload que falha
  ```

### BUG-02 · `bodyParser.json()` duplicado com `express.json()` · [P2]

- **Arquivo:** `index.js:25` e `:38`
- **Evidência:** ambos são `app.use` (não `only`): o body é parseado **duas vezes**.
- **Impacto:** trabalho duplicado em toda requisição com body; e é ruído que esconde o `BUG-00`
  (a ordem).
- **Mudança:** remover `body-parser` e usar só `express.json({ limit: '100kb' })` + `express.urlencoded`.
- **Aceite:** uma passada de parse, com limite.
- **Verificação:**
  ```bash
  grep -c 'bodyParser.json\|express.json' index.js   # 1 (so o express, com limit)
  ```

### BUG-03 · `swagger_output.json` importado (pode não existir) · [P2]

- **Arquivo:** `index.js:6`
- **Evidência:** `require('./swagger_output.json')` no topo — se o arquivo gerado não existir
  (clone novo sem rodar o gerador), **o processo morre no boot**.
- **Impacto:** acoplamento a artefato gerado no boot. Ver `BUG-03` do gêmeo (mesmo padrão).
- **Mudança:** gerar no start (`prestart`) ou tornar o import tolerante (`try/catch`) e servir o
  Swagger só se existir; gitignorar o gerado.
- **Aceite:** `rm swagger_output.json && npm start` funciona.
- **Verificação:**
  ```bash
  rm -f swagger_output.json && npm start & sleep 2; curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/
  ```

### IMP-01 · Sem `helmet`/headers de segurança · [P2]

- **Arquivo:** `index.js` (só `cors`, `bodyParser`, erro de JSON)
- **Evidência:** nenhum `helmet`.
- **Impacto:** sem `nosniff`/`X-Frame-Options`/HSTS. O Swagger pode ser *frameado*.
- **Mudança:** `npm i helmet` + `app.use(helmet())` antes das rotas.
- **Aceite:** headers presentes nas respostas.
- **Verificação:**
  ```bash
  curl -sI http://localhost:3000/ | grep -iE 'x-frame-options|x-content-type-options'
  ```

### IMP-02 · Sem `PORT` validado / sem shutdown gracioso · [P2]

- **Arquivo:** `index.js:11,21`
- **Evidência:** `const port = process.env.PORT;` (sem default) e `app.listen` sem `error` handler,
  sem `SIGTERM`.
- **Impacto:** sem `PORT`, `listen(undefined)` é falha; EADDRINUSE engolido; `docker stop` corta.
- **Mudança:** `const port = Number(process.env.PORT) || 3000;` + `server.on('error')` + `SIGTERM`.
- **Aceite:** EADDRINUSE sai com erro; SIGTERM fecha limpo.
- **Verificação:**
  ```bash
  npm start & sleep 2; npm start   # segunda instancia deve falhar com EADDRINUSE explicito
  ```

### IMP-03 · Front: chamada HTTP manual sem tratamento de erro · [P2]

- **Arquivo:** front `front-end-example-code-online-store/src/pages/functions/https-request.js`
- **Evidência:** camada de request manual (fetch/axios) usada pelas páginas (login, signup, perfil).
- **Impacto:** sem tratamento de erro consistente, a UI mostra erro genérico (ou nada) em falha de
  rede/401 — e não aplica o header `Authorization` de forma centralizada.
- **Mudança:** (1) centralizar o client (uma função `api()` com base URL, header `Authorization`,
  tratamento de `401`/`429`/rede); (2) nas páginas, usar essa função em vez de fetch solto;
  (3) mostrar mensagem ao usuário.
- **Aceite:** falha de login mostra mensagem clara; 401 redireciona para login.
- **Verificação:** (manual) derrubar o back e clicar em login → mensagem clara, sem tela branca.

---

## 5. Qualidade: testes

### TEST-01 · Zero testes no back (IDOR não detectável) · [P1]

- **Arquivo:** *(ausente)* no back (o front tem CRA, mas sem testes de integração)
- **Evidência:** nenhum arquivo de teste, nenhum script `test` no `package.json` do back.
- **Impacto:** os 2 P0 (`BUG-00`, `SEC-01`) não têm como ser detectados. E o `BUG-00` (ordem de
  registro) só apareceria em teste de integração que faça request **imediatamente** após o boot.
- **Mudança:** (1) `node --test` + `supertest`; (2) casos: token de A + `email` de B no upload →
  `403`/`404` (`SEC-01`); `POST /login` imediatamente após o boot responde (não `404` por rota
  ausente — `BUG-00`); upload sem token → `401`; upload de tipo inválido → `4xx`; login 6× → `429`.
- **Aceite:** `npm test` roda e passa; falha se o IDOR voltar.
- **Verificação:**
  ```bash
  npm test 2>&1 | tail -3
  ```

---

## 6. DevOps / Infra

### DEVOPS-01 · Sem CI · [P2]

- **Arquivo:** *(ausente)* `.github/workflows/`
- **Evidência:** sem workflow no repo (que tem 2 apps).
- **Impacto:** nada trava os P0 de volta; e o front (CRA) também não é validado.
- **Mudança:** `ci.yml` com back (`npm ci && npm test`) e front (`npm ci && npm run build` + `npm test`).
- **Aceite:** PR que quebra qualquer um dos 2 apps é bloqueado.
- **Verificação:**
  ```bash
  cd back-end-example-code-online-store && npm ci && npm test
  cd ../front-end-example-code-online-store && npm ci && npm run build
  ```

### DEVOPS-02 · Sem `.env.example` · [P2]

- **Arquivo:** *(ausente)* `.env.example` · variáveis em `index.js:11-12`,
  `controllers/userController.js:7`, `upload_fotos.js` (do gêmeo)
- **Evidência:** o projeto lê `PORT`, `BASEURL`, `MEUSEGREDO`, `EMAIL_LOGIN`, `PASSWORD`, e as do
  Cloudinary/DB — sem exemplo versionado.
- **Impacto:** quem implanta não sabe o que definir; `SEC-05` exige validação que não está documentada.
- **Mudança:** `.env.example` com todas as variáveis, comentadas, **sem** valor real.
- **Aceite:** exemplo versionado cobre todas as `process.env.*` do back.
- **Verificação:**
  ```bash
  grep -rhoE 'process\.env\.[A-Z_]+' back-end-example-code-online-store/ | sort -u
  ```

---

## 7. Documentação

### DOC-01 · README não cobre 2 apps no mesmo repo · [P3]

- **Arquivo:** `README.md`
- **Evidência:** o repo tem `back-end-example-code-online-store/` e `front-end-example-code-online-store/`
  (estrutura herdada do exemplo da Rocketseat) — o README não orienta qual subir, em qual ordem, nem
  as variáveis de cada.
- **Impacto:** quem chega não sabe como rodar (dois `package.json`, dois servidores).
- **Mudança:** README com: estrutura dos 2 apps, ordem de start (back :3000 + front :3001), variáveis
  de cada, e o link para este plano.
- **Aceite:** README lista back, front, portas e variáveis.
- **Verificação:** `grep -n 'back-end\|front-end\|PORT' README.md`.

### DOC-02 · Falta `SECURITY.md` · [P3]

- **Arquivo:** *(ausente)* `SECURITY.md`
- **Evidência:** sem política.
- **Impacto:** o `SEC-01` é exatamente a falha que precisa de regra escrita: *"o alvo de escrita
  autenticada vem do token, nunca do body"*.
- **Mudança:** criar com canal + a invariante da identidade + "token de e-mail nunca em URL".
- **Aceite:** arquivo existe com as 2 invariantes.
- **Verificação:** `ls SECURITY.md`

---

## 8. Ordem de execução (waves)

### Wave 1 — Corrigir boot e IDOR (P0)
1. **`BUG-00`** — `app.listen()` depois de todos os middlewares e rotas.
2. **`SEC-01`** — upload usa `req.user`, não `req.body.email`.
3. **`TEST-01`** — testes de integração (travando os dois).

> Depois da Wave 1, o boot não aceita tráfego antes das rotas e ninguém troca a foto de outro.

### Wave 2 — Superfície e token (P1)
4. **`SEC-03`** — limite/filtro/nome no upload + limpeza em `finally`.
5. **`SEC-02`** — CORS com allowlist (usar o que está comentado em `index.js:49-56`).
6. **`SEC-04`** — token de ativação fora da URL + single-use.
7. **`SEC-05`** — validar credenciais de e-mail no boot; senha de app.
8. **`SEC-06`** — rate limit em login/register.

### Wave 3 — Robustez (P2)
9. **`BUG-01`** — `finally` no unlink; **`BUG-02`** — parse único; **`BUG-03`** — swagger tolerante.
10. **`IMP-01`** — `helmet`; **`IMP-02`** — `PORT`/shutdown.
11. **`IMP-03`** — centralizar client HTTP no front.

### Wave 4 — Operação (P2/P3)
12. **`DEVOPS-01`** — CI (back + front); **`DEVOPS-02`** — `.env.example`.
13. **`DOC-01`**, **`DOC-02`**.

**Dependências que não podem ser invertidas:**
`BUG-00` antes de `TEST-01` (o teste de bootImmediate depende do fix) · `SEC-02` junto com `SEC-01`
(CORS é defesa do que as rotas expõem) · `SEC-03` antes de `BUG-01` (limite evita o arquivo gigante
que o `finally` apagaria) · `SEC-04` antes de `DOC-02` (a regra "token fora da URL" nasce do fix) ·
`IMP-01`/`IMP-02` antes de `DEVOPS-01` (o CI roda os testes com helmet).

---

## 9. Fora de escopo / riscos

| Item | Decisão | Motivo |
|---|---|---|
| Reescrever em TS / migrar para Nest | **Não** | O gêmeo e a família de projetos usam Express; sem ganho aqui. |
| Implementar o front em outro framework | **Não** | React/CRA é o do acervo. |
| Deletar conta / linkedin | **Não** | Features. |
| Unificar com `Db_Mongo_Empresa_Completo` | **Não, ainda** | Gêmeos por herança; unificar é feature futura. |

**Riscos desta execução:**

- **`BUG-00` (mover o listen)** pode revelar que alguma rota depende do boot anterior — teste o
  back inteiro depois.
- **`SEC-01` pode quebrar o front** se ele enviar `email` no upload e o back passar a ignorar. Ajuste
  os dois lados na mesma mudança.
- **`SEC-04` (token fora da URL)** muda o fluxo de ativação (o front lê `?token`); migre front+back.
- **`SEC-05` (validar no boot)** pode derrubar o ambiente de dev que não tem as variáveis de e-mail —
  condicione ao ambiente ou valide só em produção.

---

## 10. Definição de pronto (DoD)

**Segurança**
- [ ] `BUG-00` — `listen` depois das rotas; POST imediato após boot responde (não 404 por rota ausente)
- [ ] `SEC-01` — token de A + `email` de B no upload → `403`/`404`, foto de B não muda
- [ ] `SEC-02` — CORS com allowlist; origem de fora sem header
- [ ] `SEC-03` — upload > 5 MB ou tipo inválido → `4xx`; nome gerado; nada fica em disco
- [ ] `SEC-04` — token de ativação **fora** da URL; single-use
- [ ] `SEC-05` — sem `EMAIL_*`/`PASSWORD` o boot falha; transporter único
- [ ] `SEC-06` — 6º login em 5 min → `429`

**Funcional**
- [ ] `BUG-01` — upload falho não deixa arquivo em `uploads/`
- [ ] `BUG-02` — uma passada de parse, com limite
- [ ] `BUG-03` — `rm swagger_output.json && npm start` funciona
- [ ] `IMP-01` — headers do `helmet` presentes
- [ ] `IMP-02` — EADDRINUSE sai com erro; SIGTERM fecha limpo
- [ ] `IMP-03` — front: falha de rede mostra mensagem clara

**Testes e infra**
- [ ] `TEST-01` — `npm test` no back (≥ 5 casos) e falha se o IDOR voltar
- [ ] `DEVOPS-01` — CI verde (back + front)
- [ ] `DEVOPS-02` — `.env.example` com todas as variáveis

**Documentação**
- [ ] `DOC-01` — README cobre os 2 apps, portas e variáveis
- [ ] `DOC-02` — `SECURITY.md` com as 2 invariantes

**Validação final:**
```bash
cd back-end-example-code-online-store
npm test 2>&1 | tail -3
grep -rn 'req.body.email' routes/   # só no register/login, nao no upload
```

---

*Fim do plano. Gerado por leitura direta do código em 2026-10-02. Nenhum item já estava corrigido.*
