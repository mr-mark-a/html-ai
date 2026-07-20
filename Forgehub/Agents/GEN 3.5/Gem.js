// GEN 3.5 (Gemini) Agent Client

export async function sendToGemini(messages, apiKey, systemInstruction = '', model = 'gemini-2.5-flash', onChunk = null) {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please configure it in Settings.");
  }

  // Convert standard message history ({role, content}) to Gemini format ({role, parts})
  // Roles in Gemini must be 'user' or 'model'
  const contents = messages.map(msg => {
    const role = msg.role === 'assistant' ? 'model' : 'user';
    return {
      role: role,
      parts: [{ text: msg.content }]
    };
  });

  const payload = {
    contents: contents,
    generationConfig: {
      temperature: 0.7
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const endpoint = onChunk ? 'streamGenerateContent' : 'generateContent';
  let url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${endpoint}?key=${apiKey}`;
  if (onChunk) {
    url += '&alt=sse';
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API Error (${response.status}): ${errText}`);
  }

  if (onChunk && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep partial line

      for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine || !cleanLine.startsWith('data: ')) continue;

        try {
          const jsonText = cleanLine.substring(6);
          const parsed = JSON.parse(jsonText);
          const chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (chunkText) {
            onChunk(chunkText);
          }
        } catch (e) {
          // Chunk might be incomplete
        }
      }
    }
  } else {
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
}
