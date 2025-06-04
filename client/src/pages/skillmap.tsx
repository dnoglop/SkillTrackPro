import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DiagnosticForm } from "@/components/diagnostic-form";
import { ResultsSection } from "@/components/results-section";
import { AssessmentResponses, TrainingTrack } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Play, Clock, Award, Download } from "lucide-react";

type AppState = "landing" | "diagnostic" | "results";

export default function SkillMap() {
  const [currentState, setCurrentState] = useState<AppState>("landing");
  const [assessmentId, setAssessmentId] = useState<number | null>(null);
  const [trainingTrack, setTrainingTrack] = useState<TrainingTrack | null>(
    null,
  );
  const { toast } = useToast();

  const createAssessmentMutation = useMutation({
    mutationFn: async (responses: AssessmentResponses) => {
      const assessmentResponse = await apiRequest("POST", "/api/assessments", {
        responses,
        createdAt: new Date().toISOString(),
      });
      return assessmentResponse.json();
    },
    onSuccess: (assessment) => {
      setAssessmentId(assessment.id);
      generateTrackMutation.mutate(assessment.id);
    },
    onError: (error) => {
      toast({
        title: "Erro ao criar avaliação",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateTrackMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest(
        "POST",
        `/api/assessments/${id}/generate-track`,
        {},
      );
      return response.json();
    },
    onSuccess: (data) => {
      setTrainingTrack(data.trainingTrack);
      setCurrentState("results");
      toast({
        title: "Trilha gerada com sucesso!",
        description: "Sua trilha personalizada está pronta.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao gerar trilha",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartDiagnostic = () => {
    setCurrentState("diagnostic");
  };

  const handleDiagnosticComplete = (responses: AssessmentResponses) => {
    createAssessmentMutation.mutate(responses);
  };

  const handleBackToLanding = () => {
    setCurrentState("landing");
  };

  const handleStartNew = () => {
    setCurrentState("landing");
    setAssessmentId(null);
    setTrainingTrack(null);
  };

  if (currentState === "diagnostic") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DiagnosticForm
          onComplete={handleDiagnosticComplete}
          onBack={handleBackToLanding}
        />

        {/* Loading overlay */}
        {(createAssessmentMutation.isPending ||
          generateTrackMutation.isPending) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Gerando sua trilha personalizada...
              </h3>
              <p className="text-gray-600">
                Nossa IA está analisando suas respostas para criar a melhor
                trilha para sua equipe.
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentState === "results" && trainingTrack && assessmentId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <ResultsSection
          trainingTrack={trainingTrack}
          assessmentId={assessmentId}
          onStartNew={handleStartNew}
        />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HeroSection onStartDiagnostic={handleStartDiagnostic} />
      <HowItWorksSection />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="bg-purple-600 rounded-lg p-2 mr-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SkillMap</span>
          </div>
          <div className="flex items-center space-x-8">
            <a
              href="#como-funciona"
              className="text-gray-600 hover:text-purple-600 cursor-pointer"
            >
              Como funciona
            </a>
            <a
              href="#contato"
              className="text-gray-600 hover:text-purple-600 cursor-pointer"
            >
              Contato
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

function HeroSection({ onStartDiagnostic }: { onStartDiagnostic: () => void }) {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              Crie sua trilha de
              <br />
              treinamento
              <br />
              <span className="text-purple-600">personalizada</span>
              <br />
              em 2 minutos!
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Responda ao diagnóstico rápido das necessidades da sua equipe e
              tenha uma sugestão automática de uma trilha de desenvolvimento
              personalizada.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                onClick={onStartDiagnostic}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-base font-semibold flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Começar o diagnóstico
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 px-8 py-4 text-base font-semibold hover:bg-gray-50"
              >
                Ver um exemplo de trilha
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-600 rounded-full mr-2"></div>
                <span>Apenas 2 minutos</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>100% gratuito!</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
                <span>Gere o seu PDF</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            {/* Mockup browser window showing analytics */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="space-y-4">
                {/* Chart visualization */}
                <div className="h-3 bg-blue-200 rounded-full"></div>
                <div className="h-3 bg-purple-200 rounded-full w-4/5"></div>
                <div className="h-3 bg-green-200 rounded-full w-3/5"></div>
                <div className="h-3 bg-orange-200 rounded-full w-4/5"></div>
                <div className="h-3 bg-pink-200 rounded-full w-2/5"></div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-600 rounded mr-2"></div>
                    <div className="h-2 bg-gray-200 rounded flex-1"></div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                    <div className="h-2 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Como funciona o SkillMap?
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          Seguimos um processo simples em 3 etapas:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1: Diagnostic */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              1. Diagnóstico
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Responda 10 perguntas sobre sua equipe, objetivos e formato
              preferido de treinamento.
            </p>
          </div>

          {/* Step 2: Generation */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <Award className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              2. Análise e Geração
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Nossa IA analisa suas respostas e cria uma trilha personalizada
              com módulos, objetivos e duração sugerida.
            </p>
          </div>

          {/* Step 3: Export */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Download className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              3. Exportação
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Baixe sua trilha em PDF ou receba ela por e-mail para implementar
              imediatamente no seu dia a dia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="bg-purple-600 rounded-lg p-2 mr-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">SkillMap</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Criando trilhas de treinamento personalizadas para equipes de alto
              desempenho.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="#como-funciona"
                  className="hover:text-white transition-colors"
                >
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Exemplos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Preços
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Suporte</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a
                  href="#contato"
                  className="hover:text-white transition-colors"
                >
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Carreira
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 SkillMap. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
