import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AssessmentResponses,
  TrainingTrack,
  TrainingModule,
} from "@shared/schema";
import { storage } from "./storage";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function generateTrainingTrackWithAI(
  responses: AssessmentResponses,
): Promise<TrainingTrack> {
  // Get historical data for context
  const previousAssessments = await storage.getAllAssessments();
  const historicalContext = generateHistoricalContext(
    previousAssessments,
    responses,
  );
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = createPrompt(responses, historicalContext);
  let text = "";
  let cleanedText = "";

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    text = response.text();

    // Clean the response text to extract JSON
    cleanedText = text.trim();

    // Remove markdown code blocks if present
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/^```json\s*/, "")
        .replace(/\s*```$/, "");
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    // Parse the JSON response from Gemini
    const parsedResponse = JSON.parse(cleanedText);

    return {
      id: `track-${Date.now()}`,
      title: parsedResponse.title,
      description: parsedResponse.description,
      totalDuration: parsedResponse.totalDuration,
      modules: parsedResponse.modules,
      targetAudience: parsedResponse.targetAudience,
      mainObjective: parsedResponse.mainObjective,
    };
  } catch (error) {
    console.error("Error generating training track with AI:", error);
    if (text) console.error("Raw AI response text:", text);
    if (cleanedText) console.error("Cleaned text:", cleanedText);
    throw new Error("Falha ao gerar trilha de treinamento com IA");
  }
}

function generateHistoricalContext(
  assessments: any[],
  currentResponses: AssessmentResponses,
): string {
  if (assessments.length === 0) {
    return "Esta é a primeira avaliação no sistema. Foque em criar uma trilha altamente personalizada.";
  }

  // Analyze patterns in previous assessments
  const patterns = analyzePatterns(assessments, currentResponses);

  return `
CONTEXTO HISTÓRICO DO SISTEMA:
Total de avaliações anteriores: ${assessments.length}

PADRÕES IDENTIFICADOS:
${patterns}

PERSONALIZAÇÃO REQUERIDA:
Com base no histórico, personalize esta trilha considerando:
- Tendências específicas identificadas
- Necessidades recorrentes vs. únicas
- Abordagens que se mostraram mais eficazes
- Adaptações necessárias para este caso específico
`;
}

function analyzePatterns(
  assessments: any[],
  currentResponses: AssessmentResponses,
): string {
  const objectiveCount: Record<string, number> = {};
  const profileCount: Record<string, number> = {};
  const competencyCount: Record<string, number> = {};

  assessments.forEach((assessment) => {
    if (assessment.responses?.q1)
      objectiveCount[assessment.responses.q1] =
        (objectiveCount[assessment.responses.q1] || 0) + 1;
    if (assessment.responses?.q2)
      profileCount[assessment.responses.q2] =
        (profileCount[assessment.responses.q2] || 0) + 1;
    if (assessment.responses?.q9) {
      const competencies = Array.isArray(assessment.responses.q9)
        ? assessment.responses.q9
        : [assessment.responses.q9];
      competencies.forEach((comp: string) => {
        competencyCount[comp] = (competencyCount[comp] || 0) + 1;
      });
    }
  });

  const mostCommonObjective = Object.keys(objectiveCount).reduce(
    (a, b) => (objectiveCount[a] > objectiveCount[b] ? a : b),
    "",
  );
  const mostCommonProfile = Object.keys(profileCount).reduce(
    (a, b) => (profileCount[a] > profileCount[b] ? a : b),
    "",
  );
  const topCompetencies = Object.entries(competencyCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([comp]) => comp);

  return `
- Objetivo mais comum: ${mostCommonObjective} (${objectiveCount[mostCommonObjective] || 0} ocorrências)
- Perfil mais comum: ${mostCommonProfile} (${profileCount[mostCommonProfile] || 0} ocorrências)  
- Competências mais solicitadas: ${topCompetencies.join(", ")}
- Esta avaliação é ${currentResponses.q1 === mostCommonObjective ? "similar ao padrão" : "única em seu objetivo"}
- Observações específicas do usuário: ${currentResponses.q11 || "Nenhuma observação adicional"}
`;
}

function createPrompt(
  responses: AssessmentResponses,
  historicalContext: string,
): string {
  const questionMapping = {
    q1: "Objetivo principal",
    q2: "Perfil da equipe",
    q3: "Nível de maturidade",
    q4: "Tempo disponível",
    q5: "Formatos preferidos",
    q6: "Experiência anterior",
    q7: "Avaliação de impacto",
    q8: "Urgência",
    q9: "Competências desejadas",
    q10: "Preferência de materiais",
    q11: "Observações adicionais",
  };

  const formattedResponses = Object.entries(responses)
    .map(([key, value]) => {
      const label = questionMapping[key as keyof typeof questionMapping] || key;
      const formattedValue = Array.isArray(value) ? value.join(", ") : value;
      return `${label}: ${formattedValue}`;
    })
    .join("\n");

  return `
Você é um especialista em Learning Experience Design (LXD), andragogia e metodologia 6D para desenvolvimento de treinamentos corporativos.

${historicalContext}

Baseado nas respostas do diagnóstico abaixo, gere uma trilha de treinamento ALTAMENTE PERSONALIZADA seguindo estes princípios:

ANDRAGOGIA (Aprendizagem de Adultos):
- Autonomia e autogestão
- Experiências prévias como base
- Orientação para resolução de problemas
- Motivação intrínseca
- Aplicação imediata

LXD (Learning Experience Design):
- Foco na experiência do aprendiz
- Design centrado no usuário
- Múltiplos formatos e touchpoints
- Narrativa envolvente
- Feedback contínuo

METODOLOGIA 6D:
1. Define business outcomes (Definir resultados de negócio)
2. Design the complete experience (Projetar experiência completa)
3. Deliver for application (Entregar para aplicação)
4. Drive learning transfer (Impulsionar transferência)
5. Deploy performance support (Implementar suporte de performance)
6. Document results (Documentar resultados)

RESPOSTAS DO DIAGNÓSTICO:
${formattedResponses}

Gere um JSON com a seguinte estrutura:

{
  "title": "Nome da trilha (máximo 60 caracteres)",
  "description": "Descrição detalhada da trilha (100-150 palavras)",
  "totalDuration": "Duração total estimada",
  "targetAudience": "Público-alvo específico",
  "mainObjective": "Objetivo principal baseado na metodologia 6D",
  "modules": [
    {
      "id": "modulo-id",
      "title": "Nome do módulo",
      "description": "Descrição do módulo focada em resultados práticos",
      "duration": "Duração estimada",
      "format": ["Lista de formatos baseados nas preferências"],
      "objectives": [
        "Objetivo 1 usando taxonomia de Bloom (verbos de ação específicos)",
        "Objetivo 2 focado em aplicação prática",
        "Objetivo 3 orientado a resultados mensuráveis"
      ],
      "learningActivities": [
        "Atividade 1 baseada em andragogia",
        "Atividade 2 seguindo princípios LXD",
        "Atividade 3 aplicando metodologia 6D"
      ],
      "assessmentMethods": [
        "Método de avaliação 1",
        "Método de avaliação 2"
      ],
      "transferStrategies": [
        "Estratégia de transferência 1",
        "Estratégia de transferência 2"
      ]
    }
  ]
}

INSTRUÇÕES ESPECÍFICAS:
- Crie 3-5 módulos baseados nas competências selecionadas
- Use verbos específicos da taxonomia de Bloom nos objetivos
- Inclua estratégias de transferência para o ambiente de trabalho
- Considere as observações adicionais para personalização
- Adapte formatos e duração às preferências indicadas
- Foque em resultados práticos e aplicáveis
- Inclua elementos de gamificação se apropriado
- Considere aspectos culturais e contextuais brasileiros

Responda APENAS com o JSON válido, sem comentários adicionais.
`;
}
