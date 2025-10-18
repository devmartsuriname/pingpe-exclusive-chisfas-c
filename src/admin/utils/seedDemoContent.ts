import { supabase } from "@/integrations/supabase/client";

/**
 * Demo Content Seeder for PingPe v1.1
 * 
 * This utility populates the database with demo content for testing and demonstration.
 * All entries are marked with "(Demo)" in their titles.
 * 
 * Images sourced from:
 * - https://futureproofpingpe.com/
 * - https://www.jungleresortpingpe.com/
 */

export interface SeedResult {
  success: boolean;
  message: string;
  counts?: {
    properties: number;
    experiences: number;
    transport: number;
    packages: number;
    blog_posts: number;
  };
  errors?: string[];
}

export async function seedDemoContent(userId: string): Promise<SeedResult> {
  const errors: string[] = [];
  const counts = {
    properties: 0,
    experiences: 0,
    transport: 0,
    packages: 0,
    blog_posts: 0,
  };

  try {
    // Seed Properties (Demo Lodges)
    const properties = [
      {
        title: "Riverside Eco-Lodge (Demo)",
        description: "Experience authentic jungle living in our traditional riverside lodge. Features hammocks, natural ventilation, and stunning river views. Perfect for couples seeking tranquility and nature immersion.",
        host_id: userId,
        property_type: "cabin" as const,
        guests: 2,
        bedrooms: 1,
        beds: 1,
        bathrooms: 1,
        price_per_night: 85,
        address: "Boven-Suriname River, PingPe",
        city: "PingPe",
        country: "Suriname",
        latitude: 4.7,
        longitude: -55.2,
        images: ["/demo-content/gallery-1.jpg", "/demo-content/nature-pool.jpg"],
        is_active: true,
      },
      {
        title: "Family Jungle House (Demo)",
        description: "Spacious family accommodation with modern amenities while maintaining authentic jungle charm. Includes private outdoor area and traditional cooking facilities.",
        host_id: userId,
        property_type: "house" as const,
        guests: 6,
        bedrooms: 3,
        beds: 4,
        bathrooms: 2,
        price_per_night: 150,
        address: "PingPe Village Center",
        city: "PingPe",
        country: "Suriname",
        latitude: 4.71,
        longitude: -55.19,
        images: ["/demo-content/gallery-2.jpg", "/demo-content/gallery-3.jpg"],
        is_active: true,
      },
      {
        title: "Traditional Cabin (Demo)",
        description: "Authentic Saramaccaner cabin offering a back-to-basics experience. Sleep under mosquito nets, cook over open fire, and truly disconnect from modern life.",
        host_id: userId,
        property_type: "cabin" as const,
        guests: 4,
        bedrooms: 2,
        beds: 2,
        bathrooms: 1,
        price_per_night: 65,
        address: "PingPe Outskirts",
        city: "PingPe",
        country: "Suriname",
        latitude: 4.69,
        longitude: -55.21,
        images: ["/demo-content/gallery-4.jpg", "/demo-content/back-to-basic-tour.jpg"],
        is_active: true,
      },
    ];

    const { data: propertyData, error: propertyError } = await supabase
      .from("properties")
      .insert(properties)
      .select();

    if (propertyError) {
      errors.push(`Properties: ${propertyError.message}`);
    } else {
      counts.properties = propertyData?.length || 0;
    }

    // Seed Experiences (Tours & Activities)
    const experiences = [
      {
        title: "Back to Basic Jungle Tour (Demo)",
        description: "Immerse yourself in authentic jungle life with our signature 2-day adventure. Trek through pristine rainforest, learn traditional survival skills from local guides, and camp under the stars. Includes traditional meals cooked over open fire.",
        host_id: userId,
        duration_hours: 48,
        price_per_person: 250,
        min_participants: 2,
        max_participants: 8,
        meeting_point: "PingPe Resort Main Dock",
        difficulty_level: "moderate",
        age_restriction: 12,
        latitude: 4.7,
        longitude: -55.2,
        images: ["/demo-content/back-to-basic-tour.jpg", "/demo-content/gallery-1.jpg"],
        includes: ["Local guide", "All meals", "Camping equipment", "Transportation"],
        what_to_bring: ["Sturdy shoes", "Rain jacket", "Insect repellent", "Flashlight"],
        language: ["English", "Dutch", "Saramaccaans"],
        is_active: true,
      },
      {
        title: "Ananasberg Waterfall Expedition (Demo)",
        description: "Hike to the magnificent Ananasberg waterfall through lush rainforest. Swim in crystal-clear pools and enjoy a picnic lunch by the falls. Perfect for nature lovers and photography enthusiasts.",
        host_id: userId,
        duration_hours: 6,
        price_per_person: 75,
        min_participants: 4,
        max_participants: 12,
        meeting_point: "PingPe Resort Reception",
        difficulty_level: "easy",
        age_restriction: 6,
        latitude: 4.72,
        longitude: -55.18,
        images: ["/demo-content/ananasberg-waterfall.jpg", "/demo-content/nature-pool.jpg"],
        includes: ["Experienced guide", "Lunch", "Water", "First aid kit"],
        what_to_bring: ["Swimwear", "Towel", "Camera", "Sunscreen"],
        language: ["English", "Dutch"],
        is_active: true,
      },
      {
        title: "River Hopping Adventure (Demo)",
        description: "Explore multiple villages along the Suriname River. Travel by traditional korjaal (dugout canoe), visit local communities, and experience authentic Maroon culture. Overnight in different villages each night.",
        host_id: userId,
        duration_hours: 72,
        price_per_person: 380,
        min_participants: 2,
        max_participants: 6,
        meeting_point: "Atjoni Dock",
        difficulty_level: "moderate",
        age_restriction: 10,
        latitude: 4.7,
        longitude: -55.2,
        images: ["/demo-content/river-hopping.jpg", "/demo-content/gallery-2.jpg"],
        includes: ["Local guides", "All meals", "Accommodations", "Boat transport", "Cultural activities"],
        what_to_bring: ["Light backpack", "Quick-dry clothing", "Personal toiletries"],
        language: ["English", "Dutch", "Saramaccaans"],
        is_active: true,
      },
    ];

    const { data: experienceData, error: experienceError } = await supabase
      .from("experiences")
      .insert(experiences)
      .select();

    if (experienceError) {
      errors.push(`Experiences: ${experienceError.message}`);
    } else {
      counts.experiences = experienceData?.length || 0;
    }

    // Seed Transport
    const transport = [
      {
        title: "Boat Transfer: Atjoni to PingPe (Demo)",
        description: "Daily boat service from Atjoni dock to Jungle Resort PingPe. Enjoy scenic 2-hour journey along the Upper Suriname River. Luggage included.",
        provider_id: userId,
        vehicle_type: "boat",
        route_from: "Atjoni",
        route_to: "PingPe",
        capacity: 12,
        price_per_person: 35,
        price_per_group: null,
        duration_hours: 2,
        luggage_allowance: "One large bag and one carry-on per person",
        images: ["/demo-content/river-hopping.jpg"],
        amenities: ["Life jackets", "Covered seating", "Luggage storage"],
        is_active: true,
      },
      {
        title: "Private Charter: Full-Day River Taxi (Demo)",
        description: "Private boat charter for custom river exploration. Perfect for groups wanting flexibility. Includes experienced captain familiar with all river routes.",
        provider_id: userId,
        vehicle_type: "boat",
        route_from: "PingPe",
        route_to: "Custom Routes",
        capacity: 8,
        price_per_person: 35,
        price_per_group: 280,
        duration_hours: 8,
        luggage_allowance: "Flexible",
        images: ["/demo-content/gallery-3.jpg"],
        amenities: ["Captain", "Fuel included", "Flexible schedule", "Cooler available"],
        is_active: true,
      },
    ];

    const { data: transportData, error: transportError } = await supabase
      .from("transport")
      .insert(transport)
      .select();

    if (transportError) {
      errors.push(`Transport: ${transportError.message}`);
    } else {
      counts.transport = transportData?.length || 0;
    }

    // Seed Packages
    const packages = [
      {
        title: "Weekend in Paradise (Demo)",
        description: "Perfect 3-day/2-night introduction to PingPe. Includes riverside accommodation, Ananasberg waterfall tour, traditional meals, and boat transfers. Everything you need for an unforgettable jungle weekend.",
        creator_id: userId,
        duration_days: 3,
        max_participants: 8,
        price_total: 420,
        discount_percentage: null,
        images: ["/demo-content/nature-pool.jpg", "/demo-content/ananasberg-waterfall.jpg"],
        includes_summary: [
          "2 nights riverside lodge accommodation",
          "All meals (breakfast, lunch, dinner)",
          "Ananasberg waterfall guided tour",
          "Round-trip boat transfer from Atjoni",
          "Local guide services",
        ],
        is_active: true,
      },
    ];

    const { data: packageData, error: packageError } = await supabase
      .from("packages")
      .insert(packages)
      .select();

    if (packageError) {
      errors.push(`Packages: ${packageError.message}`);
    } else {
      counts.packages = packageData?.length || 0;
    }

    // Seed Blog Posts
    const { data: categoryData } = await supabase
      .from("blog_categories")
      .select("id")
      .limit(1)
      .single();

    const blogPosts = [
      {
        title: "Discovering the Magic of PingPe (Demo)",
        slug: "discovering-magic-of-pingpe-demo",
        excerpt: "Journey into the heart of Upper Suriname where untouched nature meets authentic Maroon culture.",
        body: `# Welcome to PingPe

PingPe is more than a destination—it's a journey back to nature's roots. Nestled along the Upper Suriname River, this remote paradise offers visitors a rare glimpse into authentic jungle life.

## Authentic Cultural Immersion

The local Saramaccaner community has preserved their traditional way of life for generations. Visitors don't just observe—they participate in daily activities, learn traditional crafts, and share meals with local families.

## Pristine Natural Beauty

From cascading waterfalls to dense rainforest canopy, PingPe's landscape is breathtaking. The region remains largely untouched by modern development, offering nature enthusiasts a true wilderness experience.

## Sustainable Tourism

Every visit to PingPe supports the local community and conservation efforts. Your stay directly contributes to preserving both cultural heritage and natural environment.

*This is demo content. Replace with authentic PingPe stories and experiences.*`,
        author_id: userId,
        category_id: categoryData?.id || null,
        status: "published",
        published_at: new Date().toISOString(),
        featured_image: "/demo-content/gallery-1.jpg",
        seo_meta: {
          title: "Discovering the Magic of PingPe | Jungle Resort",
          description: "Explore authentic jungle life in Upper Suriname's hidden gem, PingPe.",
        },
      },
      {
        title: "The Ananasberg Experience (Demo)",
        slug: "ananasberg-experience-demo",
        excerpt: "A guide to one of Suriname's most spectacular natural wonders—the Ananasberg waterfall.",
        body: `# Ananasberg Waterfall: Nature's Masterpiece

The trek to Ananasberg is an adventure in itself. Through dense jungle, across crystal streams, and finally—the thundering cascade of one of Suriname's most beautiful waterfalls.

## The Journey

Starting from PingPe, the hike takes approximately 2-3 hours through pristine rainforest. Your local guide will point out medicinal plants, animal tracks, and bird species along the way.

## The Reward

The waterfall's pools are perfect for swimming. The water is cool, clear, and incredibly refreshing after the jungle hike. Many visitors spend hours here, exploring different pools and soaking in the natural beauty.

## What to Bring

- Sturdy hiking shoes
- Swimwear
- Waterproof bag for electronics
- Camera (you'll want photos!)

*This is demo content. Replace with detailed waterfall information and guest experiences.*`,
        author_id: userId,
        category_id: categoryData?.id || null,
        status: "published",
        published_at: new Date().toISOString(),
        featured_image: "/demo-content/ananasberg-waterfall.jpg",
        seo_meta: {
          title: "Ananasberg Waterfall Experience | PingPe Tours",
          description: "Everything you need to know about visiting Suriname's spectacular Ananasberg waterfall.",
        },
      },
    ];

    const { data: blogData, error: blogError } = await supabase
      .from("blog_posts")
      .insert(blogPosts)
      .select();

    if (blogError) {
      errors.push(`Blog Posts: ${blogError.message}`);
    } else {
      counts.blog_posts = blogData?.length || 0;
    }

    // Return results
    if (errors.length > 0) {
      return {
        success: false,
        message: "Content seeding completed with errors",
        counts,
        errors,
      };
    }

    return {
      success: true,
      message: "Demo content seeded successfully!",
      counts,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to seed content",
      errors: [error.message],
    };
  }
}

export async function clearDemoContent(): Promise<SeedResult> {
  try {
    // Clear all demo entries (those with "(Demo)" in title)
    const tables = ["blog_posts", "packages", "transport", "experiences", "properties"];
    
    for (const table of tables) {
      await supabase
        .from(table as any)
        .delete()
        .like("title", "%(Demo)%");
    }

    return {
      success: true,
      message: "All demo content cleared successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      message: "Failed to clear demo content",
      errors: [error.message],
    };
  }
}
