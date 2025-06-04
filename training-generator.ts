import { TrainingTrack, TrainingModule, AssessmentResponses } from "@shared/schema";

export function generateTrainingTrack(responses: AssessmentResponses): TrainingTrack {
  const objective = responses.q1 as string;
  const profile = responses.q2 as string;
  const maturity = responses.q3 as string;
  const timeAvailable = responses.q4 as string;
  const preferredFormats = Array.isArray(responses.q5) ? responses.q5 : [responses.q5];
  const competencies = Array.isArray(responses.q9) ? responses.q9 : [responses.q9];
  
  let trackTitle = "";
  let trackDescription = "";
  let modules: TrainingModule[] = [];
  let totalDuration = "";

  // Generate track based on main objective
  switch (objective) {
    case "performance":
      trackTitle = "Trilha de Performance Técnica";
      trackDescription = "Desenvolvimento de competências técnicas para melhoria de performance";
      modules = generatePerformanceModules(competencies, preferredFormats, maturity);
      break;
    case "soft-skills":
      trackTitle = "Trilha de Desenvolvimento de Soft Skills";
      trackDescription = "Fortalecimento de habilidades interpessoais e comportamentais";
      modules = generateSoftSkillsModules(competencies, preferredFormats, maturity);
      break;
    case "engagement":
      trackTitle = "Trilha de Engajamento e Motivação";
      trackDescription = "Estratégias para aumentar o engajamento e motivação da equipe";
      modules = generateEngagementModules(competencies, preferredFormats, maturity);
      break;
    case "productivity":
      trackTitle = "Trilha de Produtividade e Foco";
      trackDescription = "Técnicas e ferramentas para maximizar produtividade";
      modules = generateProductivityModules(competencies, preferredFormats, maturity);
      break;
    case "new-role":
      trackTitle = "Trilha de Preparação para Nova Função";
      trackDescription = "Desenvolvimento de competências para transição de carreira";
      modules = generateNewRoleModules(competencies, preferredFormats, maturity, profile);
      break;
    default:
      trackTitle = "Trilha de Desenvolvimento Personalizada";
      trackDescription = "Trilha customizada baseada nas necessidades identificadas";
      modules = generateDefaultModules(competencies, preferredFormats, maturity);
  }

  // Calculate total duration based on time available
  totalDuration = calculateTotalDuration(timeAvailable, modules.length);

  return {
    id: `track-${Date.now()}`,
    title: trackTitle,
    description: trackDescription,
    totalDuration,
    modules,
    targetAudience: getTargetAudience(profile),
    mainObjective: objective
  };
}

function generateSoftSkillsModules(competencies: string[], formats: string[], maturity: string): TrainingModule[] {
  const modules: TrainingModule[] = [];
  
  if (competencies.includes("leadership")) {
    modules.push({
      id: "leadership-fundamentals",
      title: "Fundamentos da Liderança",
      description: "Desenvolver competências básicas de liderança e autoconhecimento",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Compreender estilos de liderança",
        "Desenvolver autoconhecimento",
        "Identificar pontos fortes e áreas de melhoria"
      ]
    });
  }

  if (competencies.includes("communication")) {
    modules.push({
      id: "effective-communication",
      title: "Comunicação Eficaz",
      description: "Técnicas de comunicação clara e persuasiva",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Dominar técnicas de comunicação assertiva",
        "Praticar escuta ativa",
        "Desenvolver habilidades de apresentação"
      ]
    });
  }

  if (competencies.includes("teamwork")) {
    modules.push({
      id: "team-management",
      title: "Gestão de Equipes",
      description: "Estratégias para motivar e desenvolver equipes de alto desempenho",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Aplicar técnicas de motivação",
        "Gerenciar conflitos efetivamente",
        "Implementar feedback construtivo"
      ]
    });
  }

  if (competencies.includes("emotional-intelligence")) {
    modules.push({
      id: "emotional-intelligence",
      title: "Inteligência Emocional",
      description: "Desenvolvimento da inteligência emocional para liderança",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Desenvolver autocontrole emocional",
        "Praticar empatia e compreensão",
        "Gerenciar relacionamentos interpessoais"
      ]
    });
  }

  // Ensure we have at least 3 modules
  if (modules.length < 3) {
    modules.push({
      id: "collaboration-skills",
      title: "Habilidades de Colaboração",
      description: "Técnicas para melhorar a colaboração e trabalho em equipe",
      duration: "1 semana",
      format: getFormatsForModule(formats),
      objectives: [
        "Facilitar reuniões produtivas",
        "Promover ambiente colaborativo",
        "Resolver conflitos construtivamente"
      ]
    });
  }

  return modules;
}

function generatePerformanceModules(competencies: string[], formats: string[], maturity: string): TrainingModule[] {
  return [
    {
      id: "performance-analysis",
      title: "Análise de Performance",
      description: "Métodos para medir e analisar performance técnica",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Definir KPIs relevantes",
        "Implementar sistemas de medição",
        "Analisar dados de performance"
      ]
    },
    {
      id: "optimization-techniques",
      title: "Técnicas de Otimização",
      description: "Estratégias para otimizar processos e resultados",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Identificar gargalos de processo",
        "Implementar melhorias contínuas",
        "Automatizar tarefas repetitivas"
      ]
    },
    {
      id: "quality-standards",
      title: "Padrões de Qualidade",
      description: "Estabelecimento e manutenção de padrões de qualidade",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Definir padrões de qualidade",
        "Implementar controles de qualidade",
        "Criar cultura de excelência"
      ]
    }
  ];
}

function generateEngagementModules(competencies: string[], formats: string[], maturity: string): TrainingModule[] {
  return [
    {
      id: "motivation-strategies",
      title: "Estratégias de Motivação",
      description: "Técnicas para motivar e engajar equipes",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Identificar fatores motivacionais",
        "Aplicar teorias de motivação",
        "Criar ambiente engajador"
      ]
    },
    {
      id: "recognition-programs",
      title: "Programas de Reconhecimento",
      description: "Desenvolvimento de sistemas de reconhecimento eficazes",
      duration: "1 semana",
      format: getFormatsForModule(formats),
      objectives: [
        "Desenhar programa de reconhecimento",
        "Implementar feedback positivo",
        "Celebrar conquistas da equipe"
      ]
    },
    {
      id: "team-building",
      title: "Construção de Equipes",
      description: "Atividades e estratégias para fortalecer vínculos da equipe",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Promover integração da equipe",
        "Desenvolver confiança mútua",
        "Fortalecer senso de propósito"
      ]
    }
  ];
}

function generateProductivityModules(competencies: string[], formats: string[], maturity: string): TrainingModule[] {
  return [
    {
      id: "time-management",
      title: "Gestão de Tempo",
      description: "Técnicas avançadas de gestão de tempo e priorização",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Dominar técnicas de priorização",
        "Eliminar desperdícios de tempo",
        "Criar rotinas produtivas"
      ]
    },
    {
      id: "focus-techniques",
      title: "Técnicas de Foco",
      description: "Estratégias para manter foco e concentração",
      duration: "1 semana",
      format: getFormatsForModule(formats),
      objectives: [
        "Aplicar técnicas de concentração",
        "Gerenciar distrações",
        "Implementar deep work"
      ]
    },
    {
      id: "productivity-tools",
      title: "Ferramentas de Produtividade",
      description: "Uso de ferramentas digitais para maximizar produtividade",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Dominar ferramentas de gestão",
        "Automatizar processos",
        "Otimizar fluxos de trabalho"
      ]
    }
  ];
}

function generateNewRoleModules(competencies: string[], formats: string[], maturity: string, profile: string): TrainingModule[] {
  return [
    {
      id: "role-transition",
      title: "Transição de Função",
      description: "Preparação para nova função e responsabilidades",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Compreender novas responsabilidades",
        "Desenvolver competências necessárias",
        "Planejar transição eficaz"
      ]
    },
    {
      id: "skill-development",
      title: "Desenvolvimento de Competências",
      description: "Fortalecimento de habilidades específicas para nova função",
      duration: "3 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Identificar gaps de competência",
        "Desenvolver habilidades técnicas",
        "Fortalecer soft skills"
      ]
    },
    {
      id: "adaptation-strategies",
      title: "Estratégias de Adaptação",
      description: "Técnicas para adaptação rápida ao novo ambiente",
      duration: "1 semana",
      format: getFormatsForModule(formats),
      objectives: [
        "Adaptar-se rapidamente",
        "Construir relacionamentos",
        "Estabelecer credibilidade"
      ]
    }
  ];
}

function generateDefaultModules(competencies: string[], formats: string[], maturity: string): TrainingModule[] {
  return [
    {
      id: "general-development",
      title: "Desenvolvimento Geral",
      description: "Programa abrangente de desenvolvimento profissional",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Desenvolver competências gerais",
        "Fortalecer habilidades técnicas",
        "Melhorar soft skills"
      ]
    },
    {
      id: "continuous-improvement",
      title: "Melhoria Contínua",
      description: "Cultura e práticas de melhoria contínua",
      duration: "2 semanas",
      format: getFormatsForModule(formats),
      objectives: [
        "Implementar melhoria contínua",
        "Desenvolver mentalidade de crescimento",
        "Aplicar feedback efetivo"
      ]
    }
  ];
}

function getFormatsForModule(preferredFormats: string[]): string[] {
  const formatMap: Record<string, string> = {
    "videos": "Vídeos",
    "interactive": "Exercícios práticos",
    "reading": "Leitura",
    "workshops": "Workshop",
    "podcasts": "Podcasts"
  };

  return preferredFormats.map(format => formatMap[format] || format).slice(0, 3);
}

function calculateTotalDuration(timeAvailable: string, moduleCount: number): string {
  const baseWeeks = moduleCount * 2;
  
  switch (timeAvailable) {
    case "30min":
      return `${baseWeeks * 2} semanas`;
    case "30min-1h":
      return `${baseWeeks} semanas`;
    case "1h-2h":
      return `${Math.ceil(baseWeeks * 0.7)} semanas`;
    case "2h+":
      return `${Math.ceil(baseWeeks * 0.5)} semanas`;
    default:
      return `${baseWeeks} semanas`;
  }
}

function getTargetAudience(profile: string): string {
  const audienceMap: Record<string, string> = {
    "trainees": "Jovens aprendizes e estagiários",
    "junior": "Analistas iniciantes",
    "senior": "Analistas experientes",
    "leaders": "Coordenadores e líderes",
    "mixed": "Equipe multinível"
  };

  return audienceMap[profile] || "Profissionais em geral";
}
