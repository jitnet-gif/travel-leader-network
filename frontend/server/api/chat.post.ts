import Anthropic from '@anthropic-ai/sdk';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const apiKey = config.anthropicApiKey;
  if (!apiKey) throw createError({ statusCode: 500, message: 'ANTHROPIC_API_KEY not configured' });

  const body = await readBody(event);
  const { messages, language = 'ko' } = body || {};

  if (!messages?.length) throw createError({ statusCode: 400, message: 'messages required' });

  const client = new Anthropic({ apiKey });

  // English-only system prompt to avoid WAF triggers
  const system = `You are Tour Genie, an AI travel assistant for Travel Leader Network. You help tour leaders and travel agencies with airports, immigration, visas, cruises, and tour planning. ${language === 'ko' ? 'Always reply in Korean.' : 'Reply in English.'} Be concise and conversational.`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 800,
      system,
      messages: (messages as { role: string; content: string }[])
        .slice(-8)
        .map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
    });

    const reply = response.content[0]?.type === 'text' ? response.content[0].text : '';
    return { reply };
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string; error?: { type?: string; message?: string } };
    throw createError({
      statusCode: e?.status || 502,
      message: e?.error?.message || e?.message || 'Anthropic API error',
    });
  }
});
