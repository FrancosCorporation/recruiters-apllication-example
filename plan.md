# Plan — recruiters-apllication-example

## 1. Visão geral
Exemplo full stack de loja (API Express/MongoDB + SPA React), endurecido em 2026-10-11: config por ambiente validada no boot, Helmet/CORS/rate limits, ativação por e-mail com token de uso único, uploads identificados pelo usuário autenticado (5 MB, MIME+assinatura), Docker Node 24 não-root.

## 2. Arquitetura e tecnologias
Monorepo: `back-end-example-code-online-store` (Express/Mongo/JWT/Cloudinary/Swagger) + `front-end-example-code-online-store` (SPA estática via nginx). Node ^24.15.0 pinado em engines (matriz CI respeita: Node 24 apenas).

## 3. Funcionalidades existentes
- [x] Back-end endurecido completo (ver MELHORIAS §Back-end).
- [x] Front-end modernizado (ver MELHORIAS §Front-end).
- [x] CI (3 lockfiles, build, audits) — **modernizada nesta sessão** (Ubuntu 24.04, Actions v7 SHA).

## 4. Objetivos futuros
- OBJ-01 (P2, concluído nesta sessão): CI previsível.
- OBJ-02 (P3): TEST-01 — suítes em ambos os pacotes (vedada nesta esteira).
- OBJ-03 (P3): revisar `swagger_output.json` gerado legacy — MELHORIAS diz que não é mais versionado, mas o arquivo segue no checkout; confirmar remoção pendente.

## 5–9. Melhorias/Roadmap/Riscos/Ideias
- Risco: nenhum teste automatizado apesar da complexidade; OBJ-02 é a prioridade real do repo.
- Segredos Cloudinary/Mongo nunca comitados (exemplo de env sem credenciais — manter assim).

*(Gerado em 2026-10-14 pelo agente orquestrador)*
