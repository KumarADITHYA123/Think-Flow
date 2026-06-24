"use server";

import { generateText } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";
import type { DocumentOutline, Section } from "@/lib/types";
import { nanoid } from "nanoid";

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

const aiSectionSchema = z.object({
  title: z.string().optional(),
  section_title: z.string().optional(),
  subtopics: z.array(z.string()),
});

const aiOutlineSchema = z.object({
  sections: z.array(aiSectionSchema).optional(),
  document_outline: z.object({
    sections: z.array(aiSectionSchema),
  }).optional(),
});

export async function generateAIOutline(
  topic: string,
  academicLevel: string,
  documentLength: number
): Promise<DocumentOutline> {
  const systemPrompt = "You are a helpful assistant that specializes in creating detailed, well-structured research document outlines for academic purposes.";
  const promptText = [
    `Generate a comprehensive research document outline for the topic: "${topic}".`,
    `Requirements:`,
    `- Academic level: ${academicLevel}`,
    `- Target length: ~${documentLength} pages`,
    `- Structure: Use clear academic sections (e.g., Introduction, Literature Review, Methodology, Results, Discussion, Conclusion).`,
    `- Each section should have 2-4 unique, non-overlapping subtopics.`,
    `- Avoid repetition and ensure logical flow.`,
    `- Output only the outline structure, no prose or explanations.`,
    `- Do NOT output any thinking process, reasoning steps, or <think>/</think> tags in your response.`,
    `Format your response as a JSON object matching this schema:`,
    `{`,
    `  "sections": [`,
    `    {`,
    `      "title": "Section Title",`,
    `      "subtopics": ["Subtopic 1", "Subtopic 2"]`,
    `    }`,
    `  ]`,
    `}`,
  ].join("\n");

  const groqClients = getGroqClients();

  // Try Groq keys in sequence
  for (let i = 0; i < groqClients.length; i++) {
    const groqClient = groqClients[i];
    try {
      console.log(`Attempting outline generation with Groq key index ${i}...`);
      const { text } = await generateText({
        model: groqClient("meta-llama/llama-4-scout-17b-16e-instruct"),
        system: systemPrompt,
        prompt: promptText,
      });

      console.log(`Raw text (Groq key index ${i}):`, text);
      const parsedJson = extractFirstJSON(text);
      const object = aiOutlineSchema.parse(parsedJson);
      return buildOutlineResult(topic, object);
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

    console.log("Raw text (ZenMux):", text);
    const parsedJson = extractFirstJSON(text);
    const object = aiOutlineSchema.parse(parsedJson);
    return buildOutlineResult(topic, object);
  } catch (fallbackError) {
    console.error("ZenMux fallback outline generation failed:", fallbackError);
    return generateStaticOutline(topic);
  }
}

function buildOutlineResult(topic: string, object: any): DocumentOutline {
  const rawSections = object.sections || object.document_outline?.sections || [];
  const sections = rawSections.map((section: any) => ({
    id: nanoid(5),
    title: section.title || section.section_title || "Untitled Section",
    isSelected: true,
    subtopics: section.subtopics.map((subtopicTitle: any) => ({
      id: nanoid(5),
      title: subtopicTitle,
      isSelected: true,
      content: "",
    })),
  }));

  return {
    mainTopic: topic,
    sections: sections,
  };
}

function extractFirstJSON(text: string): any {
  const start = text.indexOf("{");
  if (start === -1) throw new Error("No JSON object found");
  
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") {
      depth++;
    } else if (text[i] === "}") {
      depth--;
      if (depth === 0) {
        const jsonStr = text.substring(start, i + 1);
        return JSON.parse(jsonStr);
      }
    }
  }
  throw new Error("Incomplete JSON object");
}

function generateStaticOutline(topic: string): DocumentOutline {
  const sections: Section[] = [
    {
      id: "1",
      title: "Introduction",
      isSelected: true,
      subtopics: [
        {
          id: "1-1",
          title: "Background",
          isSelected: true,
          content: `This section provides a comprehensive background on ${topic}.`,
        },
        {
          id: "1-2",
          title: "Research Question",
          isSelected: true,
          content: `The primary research question this document addresses is related to ${topic}.`,
        },
      ],
    },
    // ...other sections like in the original generateOutline
  ];

  return {
    mainTopic: topic,
    sections,
  };
}
