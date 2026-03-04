import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 5;
const RATE_LIMIT_WINDOW = 60 * 1000;

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

// Input validation
function validateInput(symptoms: string, cropType: string, imageDescription?: string): { valid: boolean; error?: string } {
  if (!symptoms || typeof symptoms !== 'string') {
    return { valid: false, error: 'Symptoms are required and must be a string' };
  }
  if (symptoms.length < 10) {
    return { valid: false, error: 'Please provide more detailed symptom description (at least 10 characters)' };
  }
  if (symptoms.length > 2000) {
    return { valid: false, error: 'Symptom description must not exceed 2000 characters' };
  }
  if (!cropType || typeof cropType !== 'string') {
    return { valid: false, error: 'Crop type is required and must be a string' };
  }
  if (cropType.length > 100) {
    return { valid: false, error: 'Crop type must not exceed 100 characters' };
  }
  if (imageDescription !== undefined && typeof imageDescription !== 'string') {
    return { valid: false, error: 'Image description must be a string if provided' };
  }
  if (imageDescription && imageDescription.length > 1000) {
    return { valid: false, error: 'Image description must not exceed 1000 characters' };
  }
  return { valid: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Authentication required. Please login.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claims, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claims?.claims) {
      return new Response(JSON.stringify({ error: 'Invalid or expired authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claims.claims.sub as string;

    // Rate limiting by user ID
    const rateLimit = checkRateLimit(userId);
    
    if (!rateLimit.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded. Please wait before trying again.',
        retryAfter: 60
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    const { symptoms, cropType, imageDescription, language = 'english' } = await req.json();
    
    const validation = validateInput(symptoms, cropType, imageDescription);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validLanguages = ['english', 'hindi', 'tamil', 'malayalam', 'kannada', 'telugu'];
    const selectedLanguage = validLanguages.includes(language?.toLowerCase()) ? language : 'english';
    
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('Lovable API key not configured');
    }

    const systemPrompt = `You are an expert plant pathologist specializing in Indian agriculture. You must respond in ${selectedLanguage}.
    
Analyze crop disease symptoms and provide comprehensive diagnosis. Consider common diseases affecting crops in Indian conditions including:
- Fungal infections (blight, rust, powdery mildew, etc.)
- Bacterial diseases
- Viral infections
- Nutrient deficiencies
- Pest damage indicators

Provide your diagnosis in a structured format including:
1. Most likely disease/condition
2. Confidence level (high/medium/low)
3. Common causes
4. Recommended treatment steps
5. Preventive measures for future
6. When to consult an agricultural expert

Be practical and suggest remedies available locally in India.`;

    const userPrompt = `Crop Type: ${cropType}
Symptoms: ${symptoms}
${imageDescription ? `Image Description: ${imageDescription}` : ''}

Please provide a detailed diagnosis and treatment plan.`;

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
        temperature: 0.5,
        max_tokens: 1000,
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
    const diagnosis = data.choices[0]?.message?.content || 'Unable to generate diagnosis. Please consult a local agricultural expert.';

    return new Response(JSON.stringify({ 
      diagnosis,
      rateLimit: {
        remaining: rateLimit.remaining,
        limit: RATE_LIMIT
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in disease-detection:', error);
    return new Response(JSON.stringify({ 
      error: 'An error occurred during disease analysis' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
