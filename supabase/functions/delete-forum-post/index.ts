import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting for delete operations
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 3; // Only 3 deletes per minute
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

function getClientIdentifier(req: Request): string {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const authHeader = req.headers.get('authorization');
  
  if (authHeader) {
    return `auth:${authHeader.slice(-20)}`;
  }
  
  return `ip:${forwardedFor?.split(',')[0] || 'unknown'}`;
}

// Input validation
function validateInput(postId: string, guestSessionId?: string): { valid: boolean; error?: string } {
  // Validate postId format (UUID)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!postId || !uuidRegex.test(postId)) {
    return { valid: false, error: 'Invalid post ID format' };
  }
  
  // Validate guestSessionId if provided (also should be UUID)
  if (guestSessionId !== undefined && guestSessionId !== null) {
    if (typeof guestSessionId !== 'string' || !uuidRegex.test(guestSessionId)) {
      return { valid: false, error: 'Invalid guest session ID format' };
    }
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
        error: 'Rate limit exceeded. You can only delete a few posts per minute.',
        retryAfter: 60
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    const { postId, isGuestPost, guestSessionId } = await req.json();
    
    // Validate inputs
    const validation = validateInput(postId, guestSessionId);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the post to check ownership
    const { data: post, error: fetchError } = await supabase
      .from('forum_posts')
      .select('guest_session_id, author_id, is_guest_post')
      .eq('id', postId)
      .single();

    if (fetchError) {
      return new Response(JSON.stringify({ error: 'Post not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For guest posts, verify session ID matches exactly
    if (post.is_guest_post) {
      if (!guestSessionId) {
        return new Response(JSON.stringify({ error: 'Guest session ID required for guest posts' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (post.guest_session_id !== guestSessionId) {
        return new Response(JSON.stringify({ error: 'Unauthorized: You can only delete your own posts' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      // For authenticated posts, check authorization header
      const authHeader = req.headers.get('authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Authorization required' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Verify the user owns this post
      const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } }
      });
      
      const token = authHeader.replace('Bearer ', '');
      const { data: claims, error: claimsError } = await userClient.auth.getClaims(token);
      
      if (claimsError || !claims?.claims) {
        return new Response(JSON.stringify({ error: 'Invalid authorization' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      const userId = claims.claims.sub;
      if (post.author_id !== userId) {
        return new Response(JSON.stringify({ error: 'Unauthorized: You can only delete your own posts' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Delete the post
    const { error: deleteError } = await supabase
      .from('forum_posts')
      .delete()
      .eq('id', postId);

    if (deleteError) {
      console.error('Error deleting post:', deleteError);
      throw deleteError;
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Post deleted successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in delete-forum-post:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred while deleting the post' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
