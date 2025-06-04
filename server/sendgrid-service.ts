import sgMail from "@sendgrid/mail";
import { TrainingTrack, AssessmentResponses } from "@shared/schema";

// Configure SendGrid with API key
sgMail.setApiKey(
  "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",
);

export async function sendPersonalizedTrainingEmailViaSendGrid(
  email: string,
  trainingTrack: TrainingTrack,
  responses: AssessmentResponses,
): Promise<boolean> {
  try {
    const personalizedContent = generatePersonalizedEmailContent(
      trainingTrack,
      responses,
    );

    console.log("Enviando email via SendGrid para:", email);

    const msg = {
      to: email,
      from: "noreplay@skillmap.com",
      subject: `Sua trilha personalizada: ${trainingTrack.title}`,
      text: personalizedContent.text,
      html: personalizedContent.html,
    };

    await sgMail.send(msg);
    console.log("Email enviado com sucesso via SendGrid para:", email);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email via SendGrid:", error);

    if (error instanceof Error) {
      console.error("Detalhes do erro:", error.message);
    }

    return false;
  }
}

function generatePersonalizedEmailContent(
  trainingTrack: TrainingTrack,
  responses: AssessmentResponses,
) {
  const personalNotes = generatePersonalNotes(responses);

  const textContent = `
Olá!

Sua trilha de treinamento personalizada está pronta!

=== ${trainingTrack.title.toUpperCase()} ===

${personalNotes}

DESCRIÇÃO:
${trainingTrack.description}

DURAÇÃO TOTAL: ${trainingTrack.totalDuration}
PÚBLICO-ALVO: ${trainingTrack.targetAudience}

MÓDULOS DE TREINAMENTO:

${trainingTrack.modules
  .map(
    (module, index) => `
${index + 1}. ${module.title} (${module.duration})
   ${module.description}
   
   Objetivos:
   ${module.objectives.map((obj) => `   • ${obj}`).join("\n")}
   
   Formato: ${module.format.join(", ")}
   
   ${
     module.learningActivities
       ? `Atividades:
   ${module.learningActivities.map((act) => `   ▶ ${act}`).join("\n")}`
       : ""
   }
   
   ${
     module.assessmentMethods
       ? `Avaliação:
   ${module.assessmentMethods.map((method) => `   ✓ ${method}`).join("\n")}`
       : ""
   }
   
   ${
     module.transferStrategies
       ? `Transferência:
   ${module.transferStrategies.map((strategy) => `   → ${strategy}`).join("\n")}`
       : ""
   }
`,
  )
  .join("\n")}

Esta trilha foi gerada especificamente para suas necessidades usando:
• Andragogia (Aprendizagem de Adultos)
• Learning Experience Design (LXD)
• Metodologia 6D para Transferência de Aprendizagem

Para melhores resultados, recomendamos implementar os módulos na sequência apresentada.

Atenciosamente,
Equipe SkillMap
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .module { background: #f8f9fa; border-left: 4px solid #667eea; margin: 15px 0; padding: 15px; }
        .personal-note { background: #e8f4f8; border: 1px solid #b8daff; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .objectives { background: #fff; padding: 10px; margin: 10px 0; border-radius: 3px; }
        .methodology { background: #f0f8ff; padding: 15px; margin: 20px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎯 ${trainingTrack.title}</h1>
        <p>Sua trilha de treinamento personalizada</p>
      </div>
      
      <div class="content">
        <div class="personal-note">
          <h3>💡 Observações Personalizadas</h3>
          ${personalNotes}
        </div>
        
        <h2>📋 Visão Geral</h2>
        <p><strong>Descrição:</strong> ${trainingTrack.description}</p>
        <p><strong>Duração Total:</strong> ${trainingTrack.totalDuration}</p>
        <p><strong>Público-Alvo:</strong> ${trainingTrack.targetAudience}</p>
        
        <h2>📚 Módulos de Treinamento</h2>
        
        ${trainingTrack.modules
          .map(
            (module, index) => `
          <div class="module">
            <h3>Módulo ${index + 1}: ${module.title}</h3>
            <p><strong>Duração:</strong> ${module.duration} | <strong>Formato:</strong> ${module.format.join(", ")}</p>
            <p>${module.description}</p>
            
            <div class="objectives">
              <h4>🎯 Objetivos de Aprendizagem:</h4>
              <ul>
                ${module.objectives.map((obj) => `<li>${obj}</li>`).join("")}
              </ul>
            </div>
            
            ${
              module.learningActivities
                ? `
              <h4>🔄 Atividades de Aprendizagem:</h4>
              <ul>
                ${module.learningActivities.map((act) => `<li>${act}</li>`).join("")}
              </ul>
            `
                : ""
            }
            
            ${
              module.assessmentMethods
                ? `
              <h4>✅ Métodos de Avaliação:</h4>
              <ul>
                ${module.assessmentMethods.map((method) => `<li>${method}</li>`).join("")}
              </ul>
            `
                : ""
            }
            
            ${
              module.transferStrategies
                ? `
              <h4>🚀 Estratégias de Transferência:</h4>
              <ul>
                ${module.transferStrategies.map((strategy) => `<li>${strategy}</li>`).join("")}
              </ul>
            `
                : ""
            }
          </div>
        `,
          )
          .join("")}
        
        <div class="methodology">
          <h3>🧠 Metodologia Aplicada</h3>
          <p>Esta trilha foi desenvolvida com base em:</p>
          <ul>
            <li><strong>Andragogia:</strong> Princípios de aprendizagem de adultos</li>
            <li><strong>LXD:</strong> Learning Experience Design centrado no usuário</li>
            <li><strong>6D:</strong> Metodologia para transferência efetiva de aprendizagem</li>
          </ul>
        </div>
        
        <p><em>Para melhores resultados, recomendamos implementar os módulos na sequência apresentada.</em></p>
        
        <hr>
        <p style="text-align: center; color: #666;">
          <strong>SkillMap</strong> - Trilhas de Treinamento Personalizadas<br>
          Gerado por IA com base em suas respostas específicas
        </p>
      </div>
    </body>
    </html>
  `;

  return {
    text: textContent,
    html: htmlContent,
  };
}

function generatePersonalNotes(responses: AssessmentResponses): string {
  const objective = responses.q1 as string;
  const profile = responses.q2 as string;
  const maturity = responses.q3 as string;
  const observations = responses.q11 as string;

  const objectiveMap: Record<string, string> = {
    performance: "performance técnica",
    "soft-skills": "desenvolvimento de soft skills",
    engagement: "engajamento da equipe",
    productivity: "produtividade e foco",
    "new-role": "preparação para nova função",
  };

  const profileMap: Record<string, string> = {
    trainees: "jovens aprendizes/estagiários",
    junior: "analistas iniciantes",
    senior: "analistas experientes",
    leaders: "coordenadores/líderes",
    mixed: "equipe multinível",
  };

  let personalizedMessage = `
    Com base em suas respostas, identificamos que seu foco principal é <strong>${objectiveMap[objective] || objective}</strong> 
    para uma equipe de <strong>${profileMap[profile] || profile}</strong> com nível de maturidade <strong>${maturity}/5</strong>.
  `;

  if (observations && observations.trim()) {
    personalizedMessage += `
    <br><br><strong>Suas observações específicas foram consideradas:</strong><br>
    <em>"${observations}"</em><br><br>
    Esta informação foi fundamental para personalizar cada módulo às suas necessidades únicas.
    `;
  }

  return personalizedMessage;
}
