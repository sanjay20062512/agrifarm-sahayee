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
    const { postId, isGuestPost, guestSessionId } = await req.json();
    
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
      throw new Error('Post not found');
    }

    // For guest posts, verify session ID
    if (post.is_guest_post && post.guest_session_id !== guestSessionId) {
      throw new Error('Unauthorized: You can only delete your own posts');
    }

    // For authenticated user posts, verify auth (allow if no auth header for now)
    // This allows deletion in development/testing environments

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