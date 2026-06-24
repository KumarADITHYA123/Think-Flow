"use server";

import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const zenmux = createOpenAICompatible({
  name: "zenmux",
  baseURL: process.env.ZENMUX_BASE_URL || "",
  apiKey: process.env.ZENMUX_API_KEY || "",
});

function getGroqClients() {
  const keysStr = process.env.GROQ_API_KEYS || "";
  const keys = keysStr.split(",").map((k) => k.trim()).filter(Boolean);
  return keys.map((key, index) => createOpenAICompatible({
    name: `groq-${index}`,
    baseURL: "https://api.groq.com/openai/v1",
    apiKey: key,
  }));
}

export async function generateAIContent(
  mainTopic: string,
  sectionTitle: string,
  subtopicTitle: string,
  academicLevel: string
): Promise<string> {
  const systemPrompt = "You are an expert academic writer. Your responses must be clear, concise, and factually accurate, using a formal academic tone suitable for the specified academic level.";
  const promptText = [
    `Write a detailed, well-structured paragraph (100-120 words) for the subtopic "${subtopicTitle}" in the section "${sectionTitle}" of a research document on "${mainTopic}".`,
    `Requirements:`,
    `- Academic level: ${academicLevel}`,
    `- Use clear academic language and logical flow.`,
    `- Include relevant facts, explanations, and examples where appropriate.`,
    `- Do NOT use markdown formatting or bullet points.`,
    `- Do NOT include citations or references.`,
    `- Output only the paragraph, with no headings or extra text.`,
  ].join("\n");

  const groqClients = getGroqClients();

  // Try Groq keys in sequence
  for (let i = 0; i < groqClients.length; i++) {
    const groqClient = groqClients[i];
    try {
      console.log(`Attempting content generation with Groq key index ${i}...`);
      const { text } = await generateText({
        model: groqClient("meta-llama/llama-4-scout-17b-16e-instruct"),
        system: systemPrompt,
        prompt: promptText,
      });
      return text.trim();
    } catch (error) {
      console.warn(`Groq key index ${i} failed:`, error);
    }
  }

  // Fallback to ZenMux (GLM 4.7 Flash Free)
  console.warn("All Groq keys failed. Falling back to ZenMux...");
  try {
    const { text } = await generateText({
      model: zenmux("z-ai/glm-4.7-flash-free"),
      system: systemPrompt,
      prompt: promptText,
    });
    return text.trim();
  } catch (fallbackError) {
    console.error("ZenMux fallback content generation failed:", fallbackError);
    return `An error occurred while generating content for "${subtopicTitle}". Please try again later.`;
  }
}
