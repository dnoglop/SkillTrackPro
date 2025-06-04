# Configuração para Deploy

## Problema: Repository does not contain the requested branch or commit reference

Este erro ocorre quando o repositório Git está vazio ou não tem commits. Para resolver:

### Passos para Deploy:

1. **Inicializar o repositório Git** (se necessário):
```bash
git init
git add .
git commit -m "Initial commit - SkillMap platform"
```

2. **Conectar ao repositório remoto**:
```bash
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

3. **Variáveis de ambiente necessárias**:
- `DATABASE_URL` - URL do PostgreSQL
- `GOOGLE_API_KEY` - Chave da API do Gemini AI
- `SENDGRID_API_KEY` - Chave do SendGrid (já configurado)

### Estrutura do Projeto para Deploy:

- ✅ `package.json` com scripts de build
- ✅ `tsconfig.json` configurado
- ✅ `vite.config.ts` para build
- ✅ Arquivos de banco de dados (Drizzle)
- ✅ Código limpo sem dependências desnecessárias

### Comando de Deploy:
```bash
npm run build
```

O projeto está pronto para deploy após resolver a questão do Git.