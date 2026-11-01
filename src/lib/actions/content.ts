"use server";

import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

const omnirouteClient = createOpenAICompatible({
  name: "omniroute",
  baseURL: process.env.OMNIROUTE_BASE_URL || "http://127.0.0.1:20128/v1",
  apiKey: process.env.OMNIROUTE_API_KEY || "sk-fe9789691b334c1d-79c517-37724f60",
});

const zenmux = createOpenAICompatible({
  name: "zenmux",
  baseURL: process.env.ZENMUX_BASE_URL || "",
  apiKey: process.env.ZENMUX_API_KEY || "",
});

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

  const modelName = process.env.OMNIROUTE_MODEL || "antigravity/gemini-3.8-flash-high";

  // Primary: OmniRoute Gemini 3.8 Flash
  try {
    console.log(`Attempting content generation with OmniRoute (${modelName})...`);
    const { text } = await generateText({
      model: omnirouteClient(modelName),
      system: systemPrompt,
      prompt: promptText,
    });
    return text.trim();
  } catch (error) {
    console.warn(`OmniRoute generation with ${modelName} failed:`, error);
  }

  // Fallback to ZenMux (GLM 4.7 Flash Free)
  console.warn("OmniRoute failed. Falling back to ZenMux...");
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
