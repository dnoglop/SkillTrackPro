import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema, type TrainingTrack, type AssessmentResponses } from "@shared/schema";
import { generateTrainingTrackWithAI } from "../ai-service";
import { sendPersonalizedTrainingEmailViaSendGrid } from "./sendgrid-service";

export async function registerRoutes(app: Express): Promise<Server> {
  


  // Create new assessment
  app.post("/api/assessments", async (req, res) => {
    try {
      const validatedData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(validatedData);
      res.json(assessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Get assessment by ID
  app.get("/api/assessments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getAssessment(id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Generate training track from responses
  app.post("/api/assessments/:id/generate-track", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assessment = await storage.getAssessment(id);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const trainingTrack = await generateTrainingTrackWithAI(assessment.responses);
      
      // Update assessment with generated track
      const updatedAssessment = await storage.updateAssessment(id, {
        generatedTrack: trainingTrack
      });

      res.json({ 
        assessment: updatedAssessment,
        trainingTrack 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Send training track via email with personalization
  app.post("/api/assessments/:id/send-email", async (req, res) => {
    try {
      const { email } = req.body;
      const id = parseInt(req.params.id);
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "E-mail válido é obrigatório" });
      }

      const assessment = await storage.getAssessment(id);
      
      if (!assessment || !assessment.generatedTrack) {
        return res.status(404).json({ message: "Avaliação ou trilha não encontrada" });
      }

      // Send personalized email using SendGrid
      const emailSent = await sendPersonalizedTrainingEmailViaSendGrid(
        email,
        assessment.generatedTrack,
        assessment.responses
      );
      
      if (emailSent) {
        res.json({ 
          message: `Trilha personalizada enviada para ${email}`,
          success: true 
        });
      } else {
        res.status(500).json({ 
          message: "Falha ao enviar e-mail. Tente novamente.",
          success: false 
        });
      }
    } catch (error: any) {
      console.error("Error sending email:", error);
      
      res.status(500).json({ 
        message: error.message || "Erro ao enviar e-mail. Tente novamente.",
        success: false 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
