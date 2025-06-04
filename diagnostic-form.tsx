import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { questions } from "@/lib/questions";
import { AssessmentResponses } from "@shared/schema";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DiagnosticFormProps {
  onComplete: (responses: AssessmentResponses) => void;
  onBack: () => void;
}

export function DiagnosticForm({ onComplete, onBack }: DiagnosticFormProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [responses, setResponses] = useState<AssessmentResponses>({});

  const totalQuestions = questions.length;
  const progress = (currentQuestion / totalQuestions) * 100;
  const question = questions[currentQuestion - 1];

  const handleSingleResponse = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [`q${currentQuestion}`]: value
    }));
  };

  const handleOpenResponse = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [`q${currentQuestion}`]: value
    }));
  };

  const handleMultipleResponse = (value: string, checked: boolean) => {
    setResponses(prev => {
      const currentResponses = Array.isArray(prev[`q${currentQuestion}`]) 
        ? prev[`q${currentQuestion}`] as string[]
        : [];
      
      if (checked) {
        return {
          ...prev,
          [`q${currentQuestion}`]: [...currentResponses, value]
        };
      } else {
        return {
          ...prev,
          [`q${currentQuestion}`]: currentResponses.filter(r => r !== value)
        };
      }
    });
  };

  const canProceed = () => {
    const response = responses[`q${currentQuestion}`];
    
    // For optional questions (like open response), allow proceeding without answer
    if (!question.required) return true;
    
    if (!response) return false;
    
    if (Array.isArray(response)) {
      return response.length > 0;
    }
    
    return response.length > 0;
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      onComplete(responses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const getCurrentResponse = () => {
    return responses[`q${currentQuestion}`];
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Diagnóstico da Equipe</h2>
          <div className="flex justify-center mb-4">
            <div className="w-full max-w-lg">
              <div className="text-sm text-gray-600 mb-2 text-right">
                Pergunta {currentQuestion} de {totalQuestions}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Question Container */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-8">
            <div className="mb-6">
              <div className="text-sm text-purple-600 font-medium mb-2">
                {question.block}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {question.question}
              </h3>
            </div>

            <div className="space-y-4">
              {question.type === 'open' ? (
                // Open text response
                <div className="space-y-4">
                  <Textarea
                    placeholder="Digite suas observações aqui... (opcional)"
                    value={(getCurrentResponse() as string) || ""}
                    onChange={(e) => handleOpenResponse(e.target.value)}
                    className="min-h-[120px] resize-none"
                  />
                  <p className="text-sm text-gray-500">
                    Esta informação ajudará nossa IA a personalizar melhor sua trilha de treinamento.
                  </p>
                </div>
              ) : question.type === 'single' || question.type === 'scale' ? (
                <RadioGroup
                  value={getCurrentResponse() as string}
                  onValueChange={handleSingleResponse}
                >
                  {question.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem 
                        value={option.value} 
                        id={option.value}
                        className="text-purple-600"
                      />
                      <Label 
                        htmlFor={option.value} 
                        className="text-gray-700 cursor-pointer flex-1"
                      >
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                // Multiple choice
                <div className="space-y-4">
                  {question.options.map((option) => {
                    const currentResponses = Array.isArray(getCurrentResponse()) 
                      ? getCurrentResponse() as string[]
                      : [];
                    const isChecked = currentResponses.includes(option.value);
                    
                    return (
                      <div key={option.value} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <Checkbox
                          id={option.value}
                          checked={isChecked}
                          onCheckedChange={(checked) => 
                            handleMultipleResponse(option.value, checked as boolean)
                          }
                          className="text-purple-600"
                        />
                        <Label 
                          htmlFor={option.value} 
                          className="text-gray-700 cursor-pointer flex-1"
                        >
                          {option.text}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                {currentQuestion === 1 ? 'Voltar' : 'Anterior'}
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
              >
                {currentQuestion === totalQuestions ? 'Finalizar' : 'Próxima'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
