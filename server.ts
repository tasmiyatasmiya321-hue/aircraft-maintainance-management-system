import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "AMMS Enterprise Server" });
  });

  // AI Diagnostic endpoint for Aviation Maintenance
  app.post("/api/ai/diagnose", async (req, res) => {
    try {
      const { defectTitle, description, aircraftModel, ataCategory } = req.body;

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          success: false,
          error: "GEMINI_API_KEY is not configured.",
          fallbackDiagnosis: {
            possibleCauses: [
              "Hydraulic seal breakdown due to operational pressure cycles",
              "Loose wiring loom connection near terminal strip",
              "Sensor alignment drift"
            ],
            recommendedActions: [
              "Inspect lines using fluorescent leak detection dye",
              "Perform BITE self-test on avionics module",
              "Check ATA maintenance manual chapter 29/71 for torque specs"
            ],
            requiredPartCategories: ["Hydraulics", "Seals", "Electrical Connectors"],
            estimatedHours: 4.5
          }
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a certified Lead Aviation Maintenance Engineer & ATA Specialist.
Analyze the following aircraft defect and provide structured diagnostic advice:
- Aircraft Model: ${aircraftModel || 'Boeing 737-800'}
- ATA System Category: ${ataCategory || 'General Aviation'}
- Defect Title: ${defectTitle}
- Description: ${description}

Return a JSON object with:
1. "possibleCauses": array of 3 realistic technical root causes.
2. "recommendedActions": array of 3 step-by-step engineering corrective procedures.
3. "requiredPartCategories": array of recommended spare part types.
4. "estimatedHours": estimated labor hours (number).
5. "safetyNotice": brief critical safety or airworthiness bulletin reminder.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = response.text || "{}";
      const result = JSON.parse(text);

      res.json({
        success: true,
        diagnosis: result
      });
    } catch (err: any) {
      console.error("AI Diagnosis Error:", err);
      res.status(500).json({
        success: false,
        error: err.message || "Failed to generate AI diagnosis"
      });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AMMS Express Server running on http://localhost:${PORT}`);
  });
}

startServer();
