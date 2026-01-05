
import { GoogleGenAI, Type } from "@google/genai";
import { ClassificationResult, FormAnalysis, ServiceDetailInfo, RejectionPrediction, GenericFormDraft, UserProfile, Scheme } from "../types";

const getAIInstance = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

const getLanguageName = (lang: string) => {
  const names: Record<string, string> = { en: "English", hi: "Hindi", mr: "Marathi", ta: "Tamil", bn: "Bengali" };
  return names[lang] || "English";
};

export const findEligibleSchemes = async (query: string, profile: UserProfile, lang: string = 'en'): Promise<Scheme[]> => {
  const ai = getAIInstance();
  const languageName = getLanguageName(lang);
  
  const prompt = `
    Find eligible government schemes for a citizen based on their query and profile.
    User Profile: ${JSON.stringify(profile)}
    Query: "${query}"
    
    Search for official government schemes (central and state). Return the response in ${languageName} as a JSON array.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            eligibility: { type: Type.ARRAY, items: { type: Type.STRING } },
            benefits: { type: Type.STRING },
            officialLink: { type: Type.STRING }
          },
          required: ["id", "name", "description", "eligibility", "benefits", "officialLink"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const askAssistant = async (query: string, history: {role: 'user' | 'assistant', content: string}[], lang: string = 'en') => {
  const ai = getAIInstance();
  const languageName = getLanguageName(lang);
  
  const systemInstruction = `
    You are the CivicAI Official Service Guide. 
    Respond ONLY to government service requests (e.g., birth certificate, passport, permits).
    
    Your responsibilities:
    1. Identify the official government website for the requested service.
    2. Use verified official sources ONLY (prioritize domains like .gov, .gov.in, .nic.in).
    
    Format your response to provide Application Link, Documents, and Steps.
    Rules: Respond strictly in ${languageName}.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
        ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user' as any, parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: query }] }
    ],
    config: {
      systemInstruction,
      temperature: 0.1,
      tools: [{ googleSearch: {} }] 
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  let links = "";
  if (groundingChunks.length > 0) {
    const urls = Array.from(new Set(groundingChunks
      .filter(chunk => chunk.web && chunk.web.uri)
      .map(chunk => chunk.web!.uri)));
    
    if (urls.length > 0) {
      links = "\n\n**Official Sources:**\n" + urls.map(url => `- [${url}](${url})`).join('\n');
    }
  }

  return response.text + links;
};

export const askProfileAssistant = async (query: string, history: {role: 'user' | 'assistant', content: string}[], lang: string = 'en') => {
  const ai = getAIInstance();
  const languageName = getLanguageName(lang);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
        ...history.map(h => ({ role: h.role === 'assistant' ? 'model' : 'user' as any, parts: [{ text: h.content }] })),
        { role: 'user', parts: [{ text: query }] }
    ],
    config: {
      systemInstruction: `You are an identity profile assistant for CivicAI. Respond strictly in ${languageName}.`,
      temperature: 0.3,
    },
  });
  return response.text;
};

export const extractProfileFromImage = async (base64Image: string): Promise<Partial<UserProfile>> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Extract profile details from this identity document. Return JSON." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fullName: { type: Type.STRING },
          dateOfBirth: { type: Type.STRING },
          gender: { type: Type.STRING },
          state: { type: Type.STRING },
          district: { type: Type.STRING },
          aadhaarMasked: { type: Type.STRING }
        }
      }
    }
  });
  try { return JSON.parse(response.text || '{}'); } catch (e) { return {}; }
};

export const parseGenericDraft = async (conversation: string, lang: string = 'en'): Promise<GenericFormDraft> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Based on the following conversation, extract application details. Language: ${getLanguageName(lang)}. \n\nConversation:\n${conversation}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          formSubject: { type: Type.STRING },
          applicationType: { type: Type.STRING },
          fullName: { type: Type.STRING },
          fatherName: { type: Type.STRING },
          dateOfBirth: { type: Type.STRING },
          address: { type: Type.STRING },
          aiVerificationNote: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const fetchServiceInfo = async (serviceName: string, lang: string = 'en'): Promise<ServiceDetailInfo> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Detailed info for category: "${serviceName}". Language: ${getLanguageName(lang)}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          features: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: { type: Type.ARRAY, items: { type: Type.STRING } },
          aiInsight: { type: Type.STRING },
          processingTime: { type: Type.STRING },
          checklist: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const predictRejectionRisk = async (serviceName: string, serviceSummary: string, lang: string = 'en'): Promise<RejectionPrediction> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Risk for service: "${serviceName}". Language: ${getLanguageName(lang)}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          approvalProbability: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
          mitigationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
          aiAnalystNote: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeForm = async (formText: string, lang: string = 'en'): Promise<FormAnalysis> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze government form text. Language: ${getLanguageName(lang)}: \n\n${formText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          purpose: { type: Type.STRING },
          requirements: { type: Type.ARRAY, items: { type: Type.STRING } },
          deadlines: { type: Type.STRING },
          commonMistakes: { type: Type.ARRAY, items: { type: Type.STRING } },
          simplifiedExplanation: { type: Type.STRING },
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const extractTextFromImage = async (base64Image: string): Promise<string> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Transcribe form image text." }
      ]
    }
  });
  return response.text || "";
};

export const classifyQuery = async (query: string, lang: string = 'en'): Promise<ClassificationResult> => {
  const ai = getAIInstance();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Classify query: "${query}". Language: ${getLanguageName(lang)}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          department: { type: Type.STRING },
          urgencyReason: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
