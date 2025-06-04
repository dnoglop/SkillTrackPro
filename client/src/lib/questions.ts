import { Question } from "@shared/schema";

export const questions: Question[] = [
  // BLOCO 1 - Objetivo e Perfil
  {
    id: 1,
    block: "Objetivo e perfil",
    question: "Qual é o principal objetivo com esse treinamento?",
    type: "single",
    required: true,
    options: [
      { value: "performance", text: "Melhorar a performance técnica" },
      {
        value: "soft-skills",
        text: "Desenvolver soft skills (liderança, comunicação, etc.)",
      },
      { value: "engagement", text: "Engajar e motivar a equipe" },
      { value: "productivity", text: "Aumentar produtividade e foco" },
      { value: "new-role", text: "Preparar para uma nova função" },
    ],
  },
  {
    id: 2,
    block: "Objetivo e perfil",
    question: "Qual o perfil da maioria dos colaboradores da equipe?",
    type: "single",
    required: true,
    options: [
      { value: "trainees", text: "Jovens aprendizes / Estagiários" },
      { value: "junior", text: "Analistas iniciantes" },
      { value: "senior", text: "Analistas experientes" },
      { value: "leaders", text: "Coordenadores ou líderes" },
      { value: "mixed", text: "Multinível (misturado)" },
    ],
  },
  {
    id: 3,
    block: "Objetivo e perfil",
    question: "Qual o nível atual de maturidade da equipe nesse tema?",
    type: "scale",
    required: true,
    options: [
      { value: "1", text: "Totalmente iniciantes" },
      { value: "2", text: "Conhecimento básico" },
      { value: "3", text: "Conhecimento intermediário" },
      { value: "4", text: "Conhecimento avançado" },
      {
        value: "5",
        text: "Muito experientes, precisam de atualização pontual",
      },
    ],
  },

  // BLOCO 2 - Tempo e Formato
  {
    id: 4,
    block: "Tempo e formato",
    question: "Quanto tempo por semana a equipe pode dedicar ao treinamento?",
    type: "single",
    required: true,
    options: [
      { value: "30min", text: "Menos de 30 minutos" },
      { value: "30min-1h", text: "30 minutos a 1 hora" },
      { value: "1h-2h", text: "1 a 2 horas" },
      { value: "2h+", text: "Mais de 2 horas" },
    ],
  },
  {
    id: 5,
    block: "Tempo e formato",
    question: "Qual formato você acredita que mais engaja sua equipe?",
    type: "multiple",
    required: true,
    options: [
      { value: "videos", text: "Vídeos curtos e dinâmicos" },
      { value: "interactive", text: "Jogos, quizzes e interações" },
      { value: "reading", text: "Leitura de textos/artigos" },
      { value: "workshops", text: "Oficinas presenciais ou online" },
      { value: "podcasts", text: "Podcasts ou áudios rápidos" },
    ],
  },
  {
    id: 6,
    block: "Tempo e formato",
    question: "A equipe já participou de treinamentos anteriores?",
    type: "single",
    required: true,
    options: [
      { value: "regular", text: "Sim, regularmente" },
      { value: "sporadic", text: "Sim, mas de forma esporádica" },
      { value: "never", text: "Não, será a primeira vez" },
    ],
  },

  // BLOCO 3 - Avaliação e Resultados
  {
    id: 7,
    block: "Avaliação e Resultados",
    question: "Como você gostaria de avaliar o impacto do treinamento?",
    type: "single",
    required: true,
    options: [
      { value: "tests", text: "Testes ou quizzes de conhecimento" },
      { value: "performance", text: "Avaliação de desempenho pós-treinamento" },
      { value: "self-assessment", text: "Autoavaliação dos participantes" },
      { value: "360-feedback", text: "Feedback 360º (liderança/equipe)" },
      { value: "unsure", text: "Não sei como avaliar ainda" },
    ],
  },
  {
    id: 8,
    block: "Avaliação e Resultados",
    question: "Qual a urgência para aplicar esse treinamento?",
    type: "single",
    required: true,
    options: [
      { value: "high", text: "Alta (até 1 semana)" },
      { value: "medium", text: "Média (1 a 2 semanas)" },
      { value: "low", text: "Baixa (sem prazo definido)" },
    ],
  },

  // BLOCO 4 - Prioridade de Competências
  {
    id: 9,
    block: "Prioridade de Competências",
    question: "Quais competências você gostaria de desenvolver?",
    type: "multiple",
    required: true,
    options: [
      { value: "leadership", text: "Liderança" },
      { value: "communication", text: "Comunicação" },
      { value: "teamwork", text: "Trabalho em equipe" },
      { value: "problem-solving", text: "Resolução de problemas" },
      { value: "emotional-intelligence", text: "Inteligência emocional" },
      { value: "customer-service", text: "Atendimento ao cliente" },
      { value: "creativity", text: "Criatividade e inovação" },
      { value: "analytical-thinking", text: "Pensamento analítico" },
    ],
  },
  {
    id: 10,
    block: "Prioridade de Competências",
    question: "Deseja receber materiais sugeridos com base nas respostas?",
    type: "single",
    required: true,
    options: [
      { value: "full-track", text: "Sim, quero um modelo de trilha" },
      { value: "summary-email", text: "Sim, mas só o resumo por e-mail" },
      {
        value: "explore-only",
        text: "Não, quero apenas explorar a ferramenta",
      },
    ],
  },
  {
    id: 11,
    block: "Observações Adicionais",
    question:
      "Há alguma observação específica sobre sua equipe ou contexto que possa ajudar a personalizar melhor a trilha?",
    type: "open",
    required: false,
    options: [],
  },
];
