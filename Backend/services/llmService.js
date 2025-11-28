// Use the global fetch available in Node 18+. If your Node version is older, install 'node-fetch' and
// uncomment the import above.

/**
 * generateWithLLM(prompt)
 * - Uses OPENAI_API_KEY (recommended) to call the OpenAI ChatCompletions API.
 * - You can set OPENAI_MODEL env var to override model (default: gpt-4 or gpt-3.5-turbo fallback).
 * - Returns the text content of the assistant reply.
 */
export const generateWithLLM = async (prompt) => {
  // Use Gemini (Google Generative API) ONLY. Throw if GEMINI_API_KEY is not set.
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error('GEMINI_API_KEY is not set. Set GEMINI_API_KEY in the environment to use Gemini.');
  }

  // Use the current Gemini model (gemini-1.5-flash is recommended for speed and cost)
  // const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  // Updated to use the correct v1 endpoint with generateContent method
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;

  // Build request body for Gemini generateContent endpoint
  const body = {
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: parseInt(process.env.GEMINI_MAX_OUTPUT_TOKENS || '2048', 10),
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini LLM request failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  // Extract text from the current Gemini API response format
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!reply) {
    throw new Error('Gemini returned empty reply');
  }

  return reply;
};

export default generateWithLLM;
