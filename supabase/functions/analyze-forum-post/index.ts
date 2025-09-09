import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { postId, title, content, category } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Call OpenAI API for analysis
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

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      // Fallback if JSON parsing fails
      parsedResponse = {
        analysis: aiResponse.substring(0, 200),
        suggestions: ["Consider consulting with local agricultural experts", "Check soil conditions and weather patterns", "Implement proper crop rotation practices"]
      };
    }

    // Update the post with AI analysis
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
      error: error.message || 'An error occurred during analysis' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});