import { GoogleGenAI, Modality } from "@google/genai";
import { SpeechTone } from '../types';

export const generateSpeech = async (
  text: string,
  voiceName: string,
  tone: SpeechTone
): Promise<string> => {
  // Basic check for API key
  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please check your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let toneInstruction = "";
  switch (tone) {
    case SpeechTone.FRIENDLY:
      toneInstruction = "Say cheerfully and in a friendly, warm manner: ";
      break;
    case SpeechTone.TECHNICAL:
      toneInstruction = "Say in a precise, clear, and technical manner: ";
      break;
    case SpeechTone.CORPORATE:
      toneInstruction = "Say in a professional, formal, and corporate manner: ";
      break;
    default:
      toneInstruction = "Say: ";
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `${toneInstruction}${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) {
    throw new Error("No audio data returned from the model.");
  }
  return base64Audio;
};

export const generateImage = async (prompt: string): Promise<string> => {
  // Check/Prompt for API Key if needed (required for gemini-3-pro-image-preview)
  if (typeof window !== 'undefined' && window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please check your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "4K"
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }
  throw new Error("No image generated.");
};

export const generateVideo = async (prompt: string): Promise<string> => {
  // Check/Prompt for API Key if needed (required for Veo)
  if (typeof window !== 'undefined' && window.aistudio) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
  }

  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please check your environment.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error("No video URI returned.");
  }
  return downloadLink;
};