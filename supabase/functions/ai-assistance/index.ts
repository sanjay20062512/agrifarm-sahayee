import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  
  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

function getClientIdentifier(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const authHeader = req.headers.get('authorization');
  
  if (authHeader) {
    return `auth:${authHeader.slice(-20)}`;
  }
  
  return `ip:${forwardedFor?.split(',')[0] || 'unknown'}`;
}

// Input validation
function validateInput(question: string, context: string | undefined): { valid: boolean; error?: string } {
  if (!question || typeof question !== 'string') {
    return { valid: false, error: 'Question is required and must be a string' };
  }
  
  if (question.length < 3) {
    return { valid: false, error: 'Question must be at least 3 characters long' };
  }
  
  if (question.length > 2000) {
    return { valid: false, error: 'Question must not exceed 2000 characters' };
  }
  
  if (context !== undefined && typeof context !== 'string') {
    return { valid: false, error: 'Context must be a string if provided' };
  }
  
  if (context && context.length > 1000) {
    return { valid: false, error: 'Context must not exceed 1000 characters' };
  }
  
  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientId = getClientIdentifier(req);
    const rateLimit = checkRateLimit(clientId);
    
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please wait a moment before trying again.',
        retryAfter: 60
      }), {
        status: 429,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Retry-After': '60'
        },
      });
    }

    const { question, context, language = 'english' } = await req.json();
    
    // Validate inputs
    const validation = validateInput(question, context);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Validate language
    const validLanguages = ['english', 'hindi', 'tamil', 'malayalam', 'kannada', 'telugu'];
    const selectedLanguage = validLanguages.includes(language?.toLowerCase()) ? language : 'english';
    
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    const systemPrompt = `You are an AI agricultural expert assistant for Indian farmers. You must respond in ${selectedLanguage}.
    
Your expertise includes:
- Crop cultivation and best practices for Indian crops
- Pest and disease management
- Irrigation and water management
- Soil health and fertilizer recommendations
- Weather-based farming advice
- Government schemes and subsidies for farmers
- Market prices and selling strategies

Provide practical, actionable advice suitable for small and medium-scale farmers in India.
Always be respectful and consider local farming traditions while suggesting modern improvements.
Format your response clearly with bullet points or numbered lists when appropriate.`;

    const userPrompt = context 
      ? `Context: ${context}\n\nQuestion: ${question}`
      : question;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('AI Gateway error:', response.status, errorBody);
      
      if (response.status === 429) {
        throw new Error('AI service is currently busy. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('AI service credits exhausted. Please contact support.');
      }
      throw new Error('Failed to get AI response');
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return new Response(JSON.stringify({ 
      answer,
      rateLimit: {
        remaining: rateLimit.remaining,
        limit: RATE_LIMIT
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-assistance:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred while processing your request' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
