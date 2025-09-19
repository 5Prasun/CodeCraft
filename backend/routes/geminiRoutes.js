import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/", async (req, res) => {
  try {
    const { task, code, language, description } = req.body;
    let prompt = "";

    if (task === "explain") {
      prompt = `
Give a SHORT and precise explanation of the following code.
- Keep it within 4 bullet points.
- Avoid unnecessary theory.
Code:
${code}
`;
    } else if (task === "convert") {
      prompt = `
Convert the following code to ${language}.
- Output ONLY the converted code inside a fenced code block (\`\`\`${language} ... \`\`\`).
- No extra explanation.
Code:
${code}
`;
    } else if (task === "generate") {
      prompt = `
You are a concise assistant.
1. First, write a SHORT (max 3 points) numbered plan of how to solve the requirement.
2. Then ALWAYS provide the COMPLETE ${language} code inside a fenced code block (\`\`\`${language} ... \`\`\`).
3. Do NOT skip the code or replace it with logic only.

Requirement:
${description}
`;
    }

    const result = await model.generateContent(prompt);
    let output = String(result.response.text()).trim();

    if (task !== "generate") {
      const lines = output.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const numbered = lines.filter(l => /^\d+[\.\)]\s+/.test(l) || /^[\-\•]\s+/.test(l));
      if (numbered.length) {
        output = numbered.slice(0, 5).join("\n");
      } else {
        const sentences = output.split(/(?<=[.!?])\s+/);
        if (sentences.length > 5) output = sentences.slice(0, 5).join(" ").trim();
      }
    }

    res.json({ output });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing request" });
  }
});

export default router;


