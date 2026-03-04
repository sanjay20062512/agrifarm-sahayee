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
function validateInput(postId: string, title: string, content: string, category: string): { valid: boolean; error?: string } {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!postId || !uuidRegex.test(postId)) {
    return { valid: false, error: 'Invalid post ID format' };
  }
  if (!title || typeof title !== 'string' || title.length < 3) {
    return { valid: false, error: 'Title must be at least 3 characters' };
  }
  if (title.length > 200) {
    return { valid: false, error: 'Title must not exceed 200 characters' };
  }
  if (!content || typeof content !== 'string' || content.length < 10) {
    return { valid: false, error: 'Content must be at least 10 characters' };
  }
  if (content.length > 5000) {
    return { valid: false, error: 'Content must not exceed 5000 characters' };
  }
  if (!category || typeof category !== 'string') {
    return { valid: false, error: 'Category is required' };
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
        error: 'Rate limit exceeded. Please wait before analyzing another post.',
        retryAfter: 60
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    const { postId, title, content, category } = await req.json();
    
    const validation = validateInput(postId, title, content, category);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase service client for DB operations
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify post exists
    const { data: existingPost, error: fetchError } = await supabase
      .from('forum_posts')
      .select('id')
      .eq('id', postId)
      .single();

    if (fetchError || !existingPost) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an agricultural AI expert. Analyze farmer forum posts and provide helpful insights, solutions, and suggestions. Focus on:
            1. Identifying the core agricultural problem or question
            2. Providing practical, actionable advice
            3. Suggesting best practices
            4. Recommending preventive measures if applicable
            5. Offering alternative solutions
            
            Return your response as a JSON object with:
            - "analysis": A brief analysis of the issue (max 200 words)
            - "suggestions": An array of 3-5 practical suggestions (each max 50 words)`
          },
          {
            role: 'user',
            content: `Category: ${category}\nTitle: ${title}\nContent: ${content}`
          }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('OpenAI API error:', response.status, errorBody);
      throw new Error('Failed to get AI analysis');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      parsedResponse = {
        analysis: aiResponse.substring(0, 200),
        suggestions: ["Consider consulting with local agricultural experts", "Check soil conditions and weather patterns", "Implement proper crop rotation practices"]
      };
    }

    const { error: updateError } = await supabase
      .from('forum_posts')
      .update({
        ai_analysis: parsedResponse.analysis,
        ai_suggestions: parsedResponse.suggestions
      })
      .eq('id', postId);

    if (updateError) {
      console.error('Error updating post:', updateError);
      throw updateError;
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: parsedResponse.analysis,
      suggestions: parsedResponse.suggestions
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-forum-post:', error);
    return new Response(JSON.stringify({ 
      error: 'An error occurred during analysis' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
