import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OptimizeImageRequest {
  mediaId: string;
  originalUrl: string;
  bucketName?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { mediaId, originalUrl, bucketName = 'media_library' }: OptimizeImageRequest = await req.json();

    console.log(`Processing image optimization for media ID: ${mediaId}`);

    // Extract the file path from the URL
    const urlParts = originalUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = urlParts.slice(urlParts.indexOf(bucketName) + 1).join('/');

    // Download the original image
    const { data: originalFile, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError) {
      console.error('Error downloading original image:', downloadError);
      throw downloadError;
    }

    // For now, we'll store the original URL as webp_url since Supabase Storage
    // doesn't support server-side image transformations without additional setup
    // In production, you would:
    // 1. Use an image processing library to convert to WebP
    // 2. Upload the WebP version to storage
    // 3. Generate srcset data for different sizes

    // Generate srcset data (using Supabase transform API parameters)
    const srcsetData = {
      sizes: [640, 768, 1024, 1280, 1920],
      webp: true,
      quality: 85
    };

    // Update the media_library record with optimization data
    const { error: updateError } = await supabase
      .from('media_library')
      .update({
        webp_url: originalUrl, // For now, use original URL - Supabase can transform on-the-fly
        srcset: srcsetData,
      })
      .eq('id', mediaId);

    if (updateError) {
      console.error('Error updating media record:', updateError);
      throw updateError;
    }

    console.log(`Successfully processed image optimization for media ID: ${mediaId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Image optimization data stored',
        srcset: srcsetData 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in optimize-image function:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
