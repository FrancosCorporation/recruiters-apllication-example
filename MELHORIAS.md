# Melhorias implementadas

Atualizado em 11/10/2026.

## Back-end

- A configuração de MongoDB, JWT, e-mail, Cloudinary, porta, URL pública e CORS agora vem do ambiente, com validação na inicialização.
- O servidor valida o banco antes de aceitar tráfego, aplica Helmet, CORS por allowlist, limites de corpo e rate limits, e encerra de forma controlada.
- Cadastro e ativação foram corrigidos: o cadastro aguarda a persistência, o envio do e-mail é habilitado, os tokens de ativação duram uma hora e só podem ser usados uma vez. O token é enviado no fragmento da URL e depois no corpo da requisição.
- Login e rotas protegidas validam o usuário ativo. Uploads usam a identidade autenticada, têm limite de 5 MB e validam MIME e assinatura do arquivo sem gravação temporária local.
- Comentários e feed validam entrada, restringem autoria ao usuário autenticado e usam paginação/populate.
- Dependências foram atualizadas e o OpenAPI passou a ser mantido manualmente. O arquivo gerado antigo de Swagger não é mais versionado.
- Docker usa Node 24, usuário sem privilégios e healthcheck. O exemplo de ambiente não contém credenciais.

## Front-end

- Migrado de Create React App para Vite, com dependências sem alertas no npm audit.
- A autenticação e ativação têm estados de carregamento e mensagens de erro/sucesso. O token de ativação é retirado da URL antes do envio.
- A comunicação HTTP centraliza JSON/FormData, erros, autenticação Bearer e expiração de sessão. Removida a criptografia no cliente com segredo embutido.
- Rotas privadas, navegação, estados vazios e saída de sessão foram ajustados.
- O container usa Nginx, fallback para rotas SPA, headers de segurança e healthcheck.

## Repositório e operação

- Compose inclui Mongo com volume e healthcheck, e publica API e front apenas em loopback.
- Adicionados exemplos de ambiente, documentação de execução e segurança e workflow de CI para instalação limpa, builds e auditoria de dependências.
- Catálogo de produtos segue como demonstração local, sem persistência ou API de CRUD.

## Verificações

- npm audit --audit-level=high no repositório, back-end e front-end: sem vulnerabilidades.
- node --check nos arquivos principais do back-end: passou.
- docker compose config --quiet: passou.
- Builds Docker do back-end e front-end: passaram.
- git diff --check: passou.
- Testes automatizados não foram executados.

## Ações fora deste repositório

- Configurar os novos valores de ambiente no provedor de deploy, incluindo MongoDB, JWT, Gmail/App Password, Cloudinary e URL/CORS.
- Rotacionar credenciais que possam ter sido usadas antes desta atualização e avaliar a limpeza coordenada do histórico Git.
- O build de CI está registrado em commit separado porque o GitHub exige escopo OAuth workflow para enviar arquivos de workflow.
