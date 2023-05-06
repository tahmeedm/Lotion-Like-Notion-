
//Old GPT text function, working but depracated.


//TODO: remove this sensitive info once I integrate it in Lambda.
const API_KEY = 'REDACTED'; //Redacted

export async function generateGPTtext(prompt) {
  try {
    const response = await fetch('https://api.openai.com/v1/engines/text-curie-001/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 600, 
        stop: null,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const GPTresult = data.choices && data.choices.length > 0 ? data.choices[0].text.trim() : '';

    return GPTresult;
  } catch (error) {
    console.error('Error generating GPT text:', error);
    return '';
  }
}
