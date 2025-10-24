import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Experience {
  id: string;
  title: string;
  tour_type: string | null;
  created_at: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    );

    console.log('Fetching all experiences...');

    // Get all experiences
    const { data: experiences, error: fetchError } = await supabaseClient
      .from('experiences')
      .select('id, title, tour_type, created_at')
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching experiences:', fetchError);
      throw fetchError;
    }

    if (!experiences || experiences.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No experiences found',
          deleted: 0,
          remaining: 0,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${experiences.length} total experiences`);

    // Group experiences by title
    const groupedByTitle = experiences.reduce((acc, exp) => {
      const key = exp.title;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(exp);
      return acc;
    }, {} as Record<string, Experience[]>);

    // Find duplicates to delete (keep newest, delete older ones)
    const toDelete: string[] = [];
    const duplicateGroups: Array<{ title: string; count: number; kept: string; deleted: number }> = [];

    for (const [title, group] of Object.entries(groupedByTitle)) {
      if (group.length > 1) {
        // Sort by created_at descending (newest first)
        const sorted = [...group].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        // Keep the first (newest), delete the rest
        const toKeep = sorted[0];
        const toDeleteInGroup = sorted.slice(1);
        
        toDelete.push(...toDeleteInGroup.map(e => e.id));
        
        duplicateGroups.push({
          title,
          count: group.length,
          kept: toKeep.id,
          deleted: toDeleteInGroup.length,
        });
        
        console.log(`Found ${group.length} duplicates of "${title}", keeping newest (${toKeep.created_at})`);
      }
    }

    if (toDelete.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No duplicate tours found',
          deleted: 0,
          remaining: experiences.length,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Deleting ${toDelete.length} duplicate experiences...`);

    // Delete duplicates
    const { error: deleteError } = await supabaseClient
      .from('experiences')
      .delete()
      .in('id', toDelete);

    if (deleteError) {
      console.error('Error deleting duplicates:', deleteError);
      throw deleteError;
    }

    const remaining = experiences.length - toDelete.length;

    console.log(`Successfully deleted ${toDelete.length} duplicates, ${remaining} remain`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Cleaned up ${toDelete.length} duplicate tours`,
        deleted: toDelete.length,
        remaining,
        duplicateGroups,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Error in cleanup-duplicate-tours:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

