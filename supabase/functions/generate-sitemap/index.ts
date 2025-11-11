import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/xml',
};

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const baseUrl = 'https://www.jungleresortpingpe.com';
    const urls: SitemapUrl[] = [];

    // Static pages with high priority
    const staticPages = [
      { loc: '/', priority: '1.0', changefreq: 'daily' },
      { loc: '/stays', priority: '0.9', changefreq: 'daily' },
      { loc: '/experiences', priority: '0.9', changefreq: 'daily' },
      { loc: '/transport', priority: '0.8', changefreq: 'daily' },
      { loc: '/events', priority: '0.8', changefreq: 'daily' },
      { loc: '/packages', priority: '0.8', changefreq: 'daily' },
      { loc: '/blog', priority: '0.8', changefreq: 'daily' },
      { loc: '/about', priority: '0.7', changefreq: 'monthly' },
      { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
      { loc: '/destinations', priority: '0.7', changefreq: 'weekly' },
      { loc: '/guide', priority: '0.6', changefreq: 'monthly' },
      { loc: '/accommodation', priority: '0.8', changefreq: 'monthly' },
      { loc: '/village', priority: '0.8', changefreq: 'monthly' },
      { loc: '/projects', priority: '0.8', changefreq: 'monthly' },
    ];

    urls.push(...staticPages);

    // Fetch published blog posts
    const { data: blogPosts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (blogPosts) {
      blogPosts.forEach((post) => {
        urls.push({
          loc: `/blog/${post.slug}`,
          lastmod: new Date(post.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.7',
        });
      });
    }

    // Fetch published dynamic pages
    const { data: pages } = await supabase
      .from('pages')
      .select('slug, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (pages) {
      pages.forEach((page) => {
        urls.push({
          loc: `/p/${page.slug}`,
          lastmod: new Date(page.updated_at).toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.6',
        });
      });
    }

    // Fetch active properties
    const { data: properties } = await supabase
      .from('properties')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (properties) {
      properties.forEach((property) => {
        urls.push({
          loc: `/stays/${property.id}`,
          lastmod: new Date(property.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.8',
        });
      });
    }

    // Fetch active experiences (official tours prioritized)
    const { data: experiences } = await supabase
      .from('experiences')
      .select('id, updated_at, is_demo')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (experiences) {
      experiences.forEach((experience) => {
        urls.push({
          loc: `/experiences/${experience.id}`,
          lastmod: new Date(experience.updated_at).toISOString().split('T')[0],
          changefreq: experience.is_demo ? 'weekly' : 'daily',
          priority: experience.is_demo ? '0.7' : '0.9',
        });
      });
    }

    // Fetch active events
    const { data: events } = await supabase
      .from('events')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (events) {
      events.forEach((event) => {
        urls.push({
          loc: `/events/${event.id}`,
          lastmod: new Date(event.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.7',
        });
      });
    }

    // Fetch active transport
    const { data: transport } = await supabase
      .from('transport')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (transport) {
      transport.forEach((item) => {
        urls.push({
          loc: `/transport/${item.id}`,
          lastmod: new Date(item.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.7',
        });
      });
    }

    // Fetch active packages
    const { data: packages } = await supabase
      .from('packages')
      .select('id, updated_at')
      .eq('is_active', true)
      .order('updated_at', { ascending: false });

    if (packages) {
      packages.forEach((pkg) => {
        urls.push({
          loc: `/packages/${pkg.id}`,
          lastmod: new Date(pkg.updated_at).toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.7',
        });
      });
    }

    // Generate XML sitemap
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${baseUrl}${url.loc}</loc>${url.lastmod ? `\n    <lastmod>${url.lastmod}</lastmod>` : ''}${url.changefreq ? `\n    <changefreq>${url.changefreq}</changefreq>` : ''}${url.priority ? `\n    <priority>${url.priority}</priority>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

    console.log(`Generated sitemap with ${urls.length} URLs`);

    return new Response(xml, {
      headers: corsHeaders,
      status: 200,
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
