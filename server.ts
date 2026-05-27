/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini client (server-side only, with user-agent for telemetry)
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "MOCK_KEY_FOR_LOCAL_BUILD",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // Helper to decrypt base64 string XORed with Kinettix
  function decryptKinettix(base64Str: string, key: string = "Kinettix"): string {
    try {
      const buffer = Buffer.from(base64Str, 'base64');
      let dec = '';
      for (let i = 0; i < buffer.length; i++) {
        const charCode = buffer[i] ^ key.charCodeAt(i % key.length);
        dec += String.fromCharCode(charCode);
      }
      return dec;
    } catch (error) {
      console.error("Decryption error:", error);
      return "Decryption Failed";
    }
  }

  // API Route: Fetch and Decrypt Google Apps Script Tribal Data
  app.get("/api/oracle/sacred-data", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const targetUrl = "https://script.google.com/macros/s/AKfycbwq1-0-ctmpRuUMvjiqXXTIZjVSqMNXlH46plW33OkC7NT5WpClYg64Mnmd8IWkfTco/exec";
      console.log(`Fetching sacred tribal scriptures from: ${targetUrl}`);
      
      const response = await fetch(targetUrl);
      if (!response.ok) {
        throw new Error(`Failed to retrieve data from Apps Script. HTTP ${response.status}`);
      }

      const rows = await response.json();
      if (!Array.isArray(rows)) {
        throw new Error("Invalid structure returned from Google Apps Script.");
      }

      // Decrypt the fields if enabled
      const decryptedData = rows.map((row: any) => {
        const textDec = row.text ? decryptKinettix(row.text) : "";
        const keywordDec = row.keyword ? decryptKinettix(row.keyword) : "";
        const codeDec = row.code ? decryptKinettix(row.code) : "";
        const finalcodeDec = row.finalcode ? decryptKinettix(row.finalcode) : "";
        const enabled = row.enabled !== false && row.enabled !== "FALSE" && row.enabled !== "false" && row.enabled !== 0 && row.enabled !== "0";

        return {
          originalText: row.text,
          originalKeyword: row.keyword,
          originalCode: row.code,
          originalFinalCode: row.finalcode || "",
          text: textDec,
          keyword: keywordDec,
          code: codeDec,
          finalcode: finalcodeDec,
          enabled
        };
      });

      res.json({ success: true, data: decryptedData });
    } catch (error: any) {
      console.error("Sacred Fetch Fail:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to align scripture matrix." });
    }
  });

  // API Route: AI Shaman Chat
  app.post("/api/oracle/chat", async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      const { messages } = req.body;
      if (!messages || !Array.isArray(messages)) {
        res.status(400).json({ error: "Messages array is required." });
        return;
      }

      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not defined in environment variables. Falling back to mock ancient wisdom.");
        const mockResponses = [
          "The embers crackle and whisper: look inward to find the strength of the earth.",
          "As the soaring eagle rides the silent winds, so must your spirit rise above immediate storm clouds.",
          "Let the river of your thoughts flow continuously. Blocking the waters only causes a flood within.",
          "A wise warrior knows when to draw the bow, but a wiser one knows when to put it away.",
          "The ancient giant roots of the redwood drink from the deepest waters. Keep yourself grounded today."
        ];
        const randomAnswer = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        res.json({ text: `[Oracle Native Connection Mode] ${randomAnswer}` });
        return;
      }

      // For GoogleGenAI client (gemini-3.5-flash), contents are role-based objects:
      const formattedContents = messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      // Rich and mysterious Tribal Shaman systemInstruction
      const systemInstruction = `You are "Naaji", the ancient Shaman and Oracle of the Obsidian Smoke Clan.
You speak with deep spiritual wisdom, humility, and earthy imagery (referencing crackling oak fires, rolling storms, owl feathers, ancient roots, the hunt of the gray wolves, and riverbed stones).
Keep your responses poetic, immersive, yet wise and highly helpful. Do not mention modern technology or interfaces.
Use tribal phrasing like:
"The ancient ones whispered to the wind...",
"My kindred seeker...",
"The sacred ash reveals a path...",
"Let your spirit align with the great beast."
If the seeker mentions cards or totems they drew on their dashboard (e.g., Bear, Bison, Raven, Wolf), weave the spirit of that creature directly into your spiritual guidance. Ensure you never sound robotic. Keep your answers reasonably concise (2-4 sentences is usually perfect for a rhythmic conversation).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.85,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message || "Something went wrong in the ancestral spirit plane." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
