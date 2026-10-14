# Resumo — recruiters-apllication-example

## Sessão 2026-10-14 (planejamento padronizado + modernização da CI)
- **Resumo:** exemplo full stack endurecido em 2026-10-11. Nesta sessão: CI com Ubuntu 24.04 e actions pinadas por SHA (checkout v7, setup-node v7); matriz mantida em Node 24 (engines do projeto). Docs padronizadas.
- **Achado registrado:** `swagger_output.json` segue versionado apesar do MELHORIAS dizer que o arquivo gerado não é mais mantido — listado como OBJ-03 (decisão de documentação do dono).
- **Validações:** CI remota roda 3 `npm ci` + build + audits; local: estático apenas.
- **Resultado:** [x] CI verde; [x] docs; [x] nada a preservar.
- **Continuidade:** HEAD sincronizado; checkout removível.
