import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrainingTrack } from "@shared/schema";
import { Download, Mail, RotateCcw, Clock, Target, Users, Shield, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";

interface ResultsSectionProps {
  trainingTrack: TrainingTrack;
  assessmentId: number;
  onStartNew: () => void;
}

export function ResultsSection({ trainingTrack, assessmentId, onStartNew }: ResultsSectionProps) {
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  const { toast } = useToast();

  const sendEmailMutation = useMutation({
    mutationFn: async (emailAddress: string) => {
      return apiRequest("POST", `/api/assessments/${assessmentId}/send-email`, {
        email: emailAddress
      });
    },
    onSuccess: () => {
      toast({
        title: "E-mail enviado!",
        description: `Trilha de treinamento enviada para ${email}`,
      });
      setEmail("");
      setShowEmailInput(false);
    },
    onError: (error: any) => {
      console.error("Error sending email:", error);
      
      toast({
        title: "Erro ao enviar e-mail",
        description: error.data?.message || error.message || "Falha ao enviar e-mail. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 6;
    let yPosition = margin;

    // Helper function to add text with wrapping and colors
    const addText = (text: string, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      pdf.setTextColor(color[0], color[1], color[2]);
      
      const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
      lines.forEach((line: string) => {
        if (yPosition > pageHeight - margin - 15) {
          pdf.addPage();
          yPosition = margin;
        }
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      yPosition += 2;
    };

    // Add colored background section
    const addSection = (title: string, bgColor = [248, 249, 250]) => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      pdf.rect(margin - 5, yPosition - 3, pageWidth - 2 * margin + 10, 12, 'F');
      addText(title, 12, true, [102, 126, 234]);
      yPosition += 3;
    };

    // Header with gradient-like effect
    pdf.setFillColor(102, 126, 234);
    pdf.rect(0, 0, pageWidth, 35, 'F');
    
    // Header content
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('🎯 ' + trainingTrack.title, margin, 20);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Sua trilha de treinamento personalizada', margin, 28);
    
    // Reset for content
    yPosition = 50;
    pdf.setTextColor(0, 0, 0);

    // Personal Notes Section (highlight box)
    pdf.setFillColor(232, 244, 248);
    pdf.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 20, 'F');
    addText('💡 Observações Personalizadas', 11, true, [102, 126, 234]);
    addText('Esta trilha foi desenvolvida especificamente com base em suas respostas, considerando seu contexto organizacional e necessidades específicas de desenvolvimento.', 10);
    yPosition += 8;

    // Overview Section
    addSection('📋 Visão Geral');
    addText(`Descrição: ${trainingTrack.description}`, 10);
    addText(`Duração Total: ${trainingTrack.totalDuration}`, 10, true);
    addText(`Público-Alvo: ${trainingTrack.targetAudience}`, 10, true);
    addText(`Objetivo Principal: ${trainingTrack.mainObjective}`, 10, true);
    yPosition += 5;

    // Training Modules Section
    addSection('📚 Módulos de Treinamento');
    
    trainingTrack.modules.forEach((module, index) => {
      // Check for page break
      if (yPosition > pageHeight - 70) {
        pdf.addPage();
        yPosition = margin;
      }
      
      // Module background
      pdf.setFillColor(248, 249, 250);
      pdf.rect(margin - 5, yPosition - 3, pageWidth - 2 * margin + 10, 8, 'F');
      
      addText(`Módulo ${index + 1}: ${module.title}`, 11, true, [102, 126, 234]);
      addText(`Duração: ${module.duration} | Formato: ${module.format.join(', ')}`, 9, false, [102, 102, 102]);
      addText(module.description, 10);
      yPosition += 2;
      
      // Objectives section
      addText('🎯 Objetivos de Aprendizagem:', 10, true, [51, 51, 51]);
      module.objectives.forEach(obj => {
        addText(`• ${obj}`, 9, false, [51, 51, 51]);
      });
      yPosition += 2;
      
      // Learning Activities
      if (module.learningActivities && module.learningActivities.length > 0) {
        addText('🔄 Atividades de Aprendizagem:', 10, true, [51, 51, 51]);
        module.learningActivities.forEach(activity => {
          addText(`• ${activity}`, 9, false, [51, 51, 51]);
        });
        yPosition += 2;
      }
      
      // Assessment Methods
      if (module.assessmentMethods && module.assessmentMethods.length > 0) {
        addText('✅ Métodos de Avaliação:', 10, true, [51, 51, 51]);
        module.assessmentMethods.forEach(method => {
          addText(`• ${method}`, 9, false, [51, 51, 51]);
        });
        yPosition += 2;
      }
      
      // Transfer Strategies
      if (module.transferStrategies && module.transferStrategies.length > 0) {
        addText('🚀 Estratégias de Transferência:', 10, true, [51, 51, 51]);
        module.transferStrategies.forEach(strategy => {
          addText(`• ${strategy}`, 9, false, [51, 51, 51]);
        });
      }
      
      yPosition += 8;
    });

    // Methodology Section
    pdf.setFillColor(240, 248, 255);
    pdf.rect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 30, 'F');
    
    addText('🧠 Metodologia Aplicada', 12, true, [102, 126, 234]);
    addText('Esta trilha foi desenvolvida com base em:', 10);
    addText('• Andragogia: Princípios de aprendizagem de adultos', 9);
    addText('• LXD: Learning Experience Design centrado no usuário', 9);
    addText('• 6D: Metodologia para transferência efetiva de aprendizagem', 9);
    yPosition += 8;

    // Implementation recommendation
    addText('Para melhores resultados, recomendamos implementar os módulos na sequência apresentada.', 9, true, [51, 51, 51]);
    yPosition += 8;

    // Footer
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    
    pdf.setTextColor(102, 102, 102);
    pdf.setFontSize(9);
    pdf.text('SkillMap - Trilhas de Treinamento Personalizadas', pageWidth / 2, yPosition, { align: 'center' });
    pdf.text('Gerado por IA com base em suas respostas específicas', pageWidth / 2, yPosition + 5, { align: 'center' });

    // Download
    pdf.save(`trilha-${trainingTrack.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);

    toast({
      title: "PDF baixado com sucesso!",
      description: "Sua trilha personalizada com layout aprimorado foi salva.",
    });
  };

  const handleSendEmail = () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "E-mail inválido",
        description: "Por favor, insira um e-mail válido",
        variant: "destructive",
      });
      return;
    }

    sendEmailMutation.mutate(email);
  };

  const getFormatBadgeColor = (format: string) => {
    const colorMap: Record<string, string> = {
      "Vídeos": "bg-blue-100 text-blue-800",
      "Exercícios práticos": "bg-green-100 text-green-800",
      "Workshop": "bg-purple-100 text-purple-800",
      "Leitura": "bg-orange-100 text-orange-800",
      "Podcasts": "bg-pink-100 text-pink-800",
    };
    return colorMap[format] || "bg-gray-100 text-gray-800";
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sua Trilha Personalizada</h2>
          <p className="text-lg text-gray-600">Baseado nas suas respostas, criamos esta trilha de desenvolvimento</p>
        </div>



        {/* Training Track Results */}
        <Card className="border border-gray-200 shadow-sm mb-8">
          <CardContent className="p-8">
            {/* Track Header */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex-1">
                  {trainingTrack.title}
                </h3>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 ml-4">
                  {trainingTrack.totalDuration}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-4">{trainingTrack.description}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{trainingTrack.targetAudience}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span>Objetivo: {trainingTrack.mainObjective}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{trainingTrack.totalDuration}</span>
                </div>
              </div>
            </div>

            {/* Modules */}
            <div className="space-y-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900">Módulos do Treinamento</h4>
              
              {trainingTrack.modules.map((module, index) => (
                <Card key={module.id} className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900">
                        Módulo {index + 1}: {module.title}
                      </h5>
                      <span className="text-sm text-gray-500">{module.duration}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    
                    {/* Objectives */}
                    <div className="mb-4">
                      <h6 className="text-sm font-medium text-gray-700 mb-2">Objetivos de Aprendizagem:</h6>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {module.objectives.map((objective, objIndex) => (
                          <li key={objIndex} className="flex items-start gap-2">
                            <span className="text-purple-600 mt-1">•</span>
                            <span>{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Learning Activities */}
                    {module.learningActivities && module.learningActivities.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Atividades de Aprendizagem:</h6>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {module.learningActivities.map((activity, actIndex) => (
                            <li key={actIndex} className="flex items-start gap-2">
                              <span className="text-blue-600 mt-1">▶</span>
                              <span>{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Assessment Methods */}
                    {module.assessmentMethods && module.assessmentMethods.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Métodos de Avaliação:</h6>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {module.assessmentMethods.map((method, methodIndex) => (
                            <li key={methodIndex} className="flex items-start gap-2">
                              <span className="text-green-600 mt-1">✓</span>
                              <span>{method}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Transfer Strategies */}
                    {module.transferStrategies && module.transferStrategies.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Estratégias de Transferência:</h6>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {module.transferStrategies.map((strategy, stratIndex) => (
                            <li key={stratIndex} className="flex items-start gap-2">
                              <span className="text-orange-600 mt-1">→</span>
                              <span>{strategy}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Format badges */}
                    <div className="flex flex-wrap gap-2">
                      {module.format.map((format, formatIndex) => (
                        <Badge 
                          key={formatIndex} 
                          variant="secondary"
                          className={getFormatBadgeColor(format)}
                        >
                          {format}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleDownloadPDF}
                  className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Baixar PDF
                </Button>
                
                <Button
                  onClick={() => setShowEmailInput(!showEmailInput)}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Receber por E-mail
                </Button>
                
                <Button
                  onClick={onStartNew}
                  variant="ghost"
                  className="text-gray-600 hover:bg-gray-100 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Criar Nova Trilha
                </Button>
              </div>

              {/* Email Input */}
              {showEmailInput && (
                <Card className="border-purple-200 bg-purple-50">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Digite seu e-mail:
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end">
                        <Button
                          onClick={handleSendEmail}
                          disabled={sendEmailMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {sendEmailMutation.isPending ? "Enviando..." : "Enviar"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
