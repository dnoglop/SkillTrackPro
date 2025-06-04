# SkillMap - Plataforma de Avaliação e Trilhas Personalizadas

Uma plataforma completa para avaliação de necessidades de desenvolvimento de equipes e geração automática de trilhas de treinamento personalizadas usando IA.

## Funcionalidades

- **Diagnóstico Inteligente**: Questionário de 11 perguntas para identificar necessidades específicas
- **IA Generativa**: Utiliza Gemini AI para criar trilhas verdadeiramente personalizadas
- **Metodologias Avançadas**: Aplica princípios de Andragogia, LXD e 6D
- **Download PDF**: Relatórios profissionais com layout estruturado
- **Envio por Email**: Entrega automática via SendGrid
- **Histórico Inteligente**: Banco PostgreSQL para personalização baseada em dados históricos

## Tecnologias

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL
- **IA**: Google Gemini AI
- **Email**: SendGrid
- **PDF**: jsPDF

## Configuração

### Variáveis de Ambiente
```
DATABASE_URL=sua_url_postgresql
GOOGLE_API_KEY=sua_chave_gemini
```

### Instalação
```bash
npm install
npm run db:push
npm run dev
```

## Deploy

O projeto está configurado para deploy automático no Replit.

## Estrutura

- `/client` - Interface React
- `/server` - API Node.js
- `/shared` - Schemas compartilhados
- Banco PostgreSQL para persistência de dados

Desenvolvido com foco em personalização real e metodologias científicas de aprendizagem.