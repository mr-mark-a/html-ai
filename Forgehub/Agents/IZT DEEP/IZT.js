// IZT DEEP Agent Client

export async function getIZTApiKey() {
  try {
    const response = await fetch('Agents/IZT DEEP/KEY.txt');
    if (!response.ok) throw new Error('Key file not found');
    const text = await response.text();
    return text.trim();
  } catch (error) {
    console.warn("Failed to fetch IZT API key from KEY.txt, using fallback", error);
    return localStorage.getItem('IZT_API_KEY') || '';
  }
}

export async function sendToIZT(messages, systemInstruction = '', onChunk = null) {
  const apiKey = await getIZTApiKey();
  if (!apiKey) {
    throw new Error("API Key for IZT DEEP is missing. Please make sure KEY.txt exists or configure it in Settings.");
  }

  const formattedMessages = [];
  if (systemInstruction) {
    formattedMessages.push({ role: 'system', content: systemInstruction });
  }
  formattedMessages.push(...messages);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: formattedMessages,
      temperature: 0.7,
      stream: onChunk ? true : false
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API Error (${response.status}): ${errText}`);
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
      buffer = lines.pop(); // Keep the last partial line in buffer

      for (const line of lines) {
        const cleanLine = line.trim();
        if (!cleanLine || !cleanLine.startsWith('data: ')) continue;
        if (cleanLine === 'data: [DONE]') continue;

        try {
          const parsedJson = JSON.parse(cleanLine.substring(6));
          const chunkText = parsedJson.choices?.[0]?.delta?.content || '';
          if (chunkText) {
            onChunk(chunkText);
          }
        } catch (e) {
          // Ignore parse errors on incomplete chunks
        }
      }
    }
  } else {
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
}
