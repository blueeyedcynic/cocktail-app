import { buildPrompt } from '../../../lib/ingredients';

export async function POST(request) {
  try {
    const { ingredients, preferences, requestType } = await request.json();
    
    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not found in environment variables');
      return Response.json(
        { error: 'API key not configured' }, 
        { status: 500 }
      );
    }
    
    // Build the prompt using our helper function
    const prompt = buildPrompt(ingredients, preferences, requestType);
    console.log('Generated prompt:', prompt);
    
    // Call the Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error details:', errorData);
      throw new Error(`Anthropic API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    const cocktailResponse = data.content[0].text;

    return Response.json({ response: cocktailResponse });
  } catch (error) {
    console.error('Error generating cocktails:', error);
    return Response.json(
      { error: 'Failed to generate cocktails' }, 
      { status: 500 }
    );
  }
}