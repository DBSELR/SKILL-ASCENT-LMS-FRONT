const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "AIzaSyCrd5Xj_cQydIW-m9qpnOXuIGF9JLT0g4w";
const FLASH_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;
const PRO_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${API_KEY}`;

export type HistoryItem = { role: 'ai' | 'user'; text: string };

export async function generateInitialQuestions(
  role: string,
  company: string,
  jdText?: string,
  resumeText?: string | null,
  _isJDBased?: boolean,
  interviewType?: string
): Promise<string[]> {
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is missing. Cannot generate questions automatically.");
  }

  let prompt = '';
  const contextText = `${jdText ? `Here is the job description:\n${jdText}\n` : ''}${resumeText ? `Here is the candidate's custom resume:\n${resumeText}\n` : ''}`;
  const companyText = company ? ` for ${company}` : '';

  if (interviewType === 'HR') {
    prompt = `You are an expert HR and behavioral interviewer${companyText}.
The candidate is interviewing for the role of ${role}.
${contextText}
Generate exactly 1 professional behavioral interview question to start the interview (e.g. 'Tell me about yourself'). Do not ask any technical questions.
Return ONLY a valid JSON array of strings containing this 1 question. Do not include markdown formatting.`;
  } else {
    prompt = `You are an expert technical interviewer${companyText}.
The candidate is interviewing for the role of ${role}.
${contextText}
Generate exactly 1 brief warm-up or introduction question related to the candidate's background to start the session. 
For example: "Can you briefly introduce yourself and highlight your relevant experience?" or "Let's start with a warm-up: could you give me a quick overview of your professional background?"
Return ONLY a valid JSON array of strings containing this 1 question. Do not include markdown formatting.`;
  }

  try {
    const response = await fetch(FLASH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to generate initial questions");
    }

    const text = data.candidates[0].content.parts[0].text.trim();
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}

    return [text]; // return as array fallback
  } catch (e) {
    console.error("Error generating initial questions:", e);
    throw e;
  }
}

export async function generateFollowUpQuestion(
  role: string,
  company: string,
  history: HistoryItem[],
  latestAnswer: string,
  interviewType?: string
): Promise<string> {
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is missing.");
  }

  const companyText = company ? `at ${company}` : '';
  let conversation = `The candidate is interviewing for ${role} ${companyText}.\n\nInterview History:\n`;
  history.forEach(h => {
    conversation += `${h.role === 'ai' ? 'Interviewer' : 'Candidate'}: ${h.text}\n`;
  });
  conversation += `Candidate's latest answer: ${latestAnswer}\n\n`;

  let prompt = '';
  if (interviewType === 'HR') {
    prompt = `${conversation}
Based on the candidate's latest answer and the conversation history, generate the next interview question.
CRITICAL INSTRUCTIONS:
- Ask purely behavioral questions (e.g. tell me about yourself, what are your strengths/weakness, where do you see yourself in next 2 years, how do you handle pressure).
- Do NOT ask any technical questions.
- You may ask a brief follow-up to their previous answer, or move on to a completely new behavioral question.
- Do not apologize, explain yourself, or add filler words. Just print the direct question.`;
  } else {
    prompt = `${conversation}
Based on the candidate's latest answer and the conversation history, generate the next technical interview question.
CRITICAL INSTRUCTIONS:
- The questions MUST be technical.
- Do NOT go deeper into the same question with sub-questions. Just ask 1 or 2 follow-ups max, and then you MUST move to a completely NEW technical question.
- Do not apologize, explain yourself, or add filler words. Just print the direct question.`;
  }

  try {
    const response = await fetch(FLASH_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7
        }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Failed to generate follow up");

    return data.candidates[0].content.parts[0].text.trim();
  } catch (e) {
    console.error("Error generating follow-up:", e);
    throw e;
  }
}

export async function generateInterviewFeedback(questions: string[], answers: string[]): Promise<any> {
  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is missing.");
  }

  let conversation = `Here is a transcript of a candidate's recent mock interview.\n\n`;
  for (let i = 0; i < questions.length; i++) {
    conversation += `Q${i + 1}: ${questions[i]}\nAnswer: ${answers[i] || 'No answer provided.'}\n\n`;
  }

  const prompt = `${conversation}
You must behave as an expert talent acquisition manager reviewing this performance.
Return a STRICTly formatted JSON object containing EXACTLY the following structure (no markdown, just raw JSON). Ensure valid quotes and closing brackets.

{
  "what_went_well": ["string", "string", "string"],
  "what_could_be_better": ["string", "string", "string"],
  "domain_knowledge_score": 85, // out of 100
  "articulation_score": 75, // out of 100
  "communication_score": 80, // out of 100
  "recommended_responses": {
     "0": "Strategy: [Briefly explain how to answer] \\n\\nExample Answer: [Provide a concrete, word-for-word example like 'My name is... I am from...']",
     "1": "Strategy: [Briefly explain how to answer] \\n\\nExample Answer: [Provide a concrete, word-for-word example]"
  }
}
Note: The keys in recommended_responses must be the string indexes of the questions (0, 1, 2, etc, matching exactly the array order).`;

  try {
    const response = await fetch(PRO_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || "Failed to generate feedback");

    const text = data.candidates[0].content.parts[0].text;
    return JSON.parse(text);
  } catch (e) {
    console.error("Error generating feedback:", e);
    throw e;
  }
}
