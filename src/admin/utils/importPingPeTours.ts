import { supabase } from "@/integrations/supabase/client";

interface DayProgram {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation?: string;
}

interface TourImportData {
  title: string;
  subtitle: string;
  tour_type: 'standard' | 'back-to-basic' | 'combination';
  duration_days: number;
  duration_hours: number;
  price_per_person: number;
  description: string;
  day_program: DayProgram[];
  includes: string[];
  what_to_bring: string[];
  keywords: string[];
  images: string[];
  meeting_point: string;
  max_participants: number;
  min_participants: number;
  difficulty_level: 'easy' | 'moderate' | 'challenging';
  language: string[];
  is_demo: false;
  transport_options: any[];
}

export interface ImportResult {
  success: boolean;
  message: string;
  counts?: { tours: number };
  errors?: string[];
}

const transportOptions = [
  {
    type: 'bus-korjaal-bus',
    name: 'Bus-Korjaal-Bus',
    description: 'Round trip by bus and korjaal boat',
    included: true
  },
  {
    type: 'bus-korjaal-flight',
    name: 'Bus-Korjaal / Flight',
    description: 'One way by bus/korjaal, one way by flight from/to Djumu airfield (45 min)',
    surcharge_note: 'Contact us for pricing'
  },
  {
    type: 'flight-return',
    name: 'Flight (Return)',
    description: 'Depart from Zorg en Hoop airfield, return from Djumu (15 min korjaal to resort)',
    surcharge_note: 'Contact us for pricing'
  }
];

export async function importPingPeTours(userId: string): Promise<ImportResult> {
  const errors: string[] = [];
  let successCount = 0;

  const tours: TourImportData[] = [
    {
      title: "Jungle Adventure – Authentic Cultural Encounter",
      subtitle: "An encounter with the pristine jungle and authentic culture of Upper Suriname!",
      tour_type: "standard",
      duration_days: 3,
      duration_hours: 72,
      price_per_person: 285,
      description: "Experience the untouched jungle and authentic culture of Upper Suriname. This 3-day adventure takes you deep into the rainforest where you'll encounter the Saramaccan culture, swim in pristine rivers, explore Tapawatra waterfall, and enjoy traditional cultural performances.",
      day_program: [
        {
          day: 1,
          title: "Paramaribo – Jungle Resort Pingpe",
          description: "Morning pickup from Paramaribo, journey through colorful Surinamese culture passing indigenous villages. Travel by bus to Atjoni harbor, then 3.5-hour korjaal ride along the beautiful Boven-Suriname River to Pingpe. Alternatively, take a 45-minute flight from Zorg en Hoop to Djumu airfield. After arrival and settling in, swim in the river, visit Pingpe village for a cultural walk, and enjoy an evening korjaal tour spotting caimans under the stars.",
          activities: ["Bus journey through Surinamese villages", "Korjaal boat ride on Boven-Suriname River", "Village walk in Pingpe", "Evening korjaal tour spotting caimans"],
          meals: ["Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 2,
          title: "Nature Walk & Tapawatra Waterfall",
          description: "After breakfast, embark on a jungle trek where your guide explains medicinal plants, trees, animals, and forest customs. Visit the stunning Tapawatra Sula waterfall for swimming and natural massage baths. Stop at Djumu health center on return. Evening cultural performance with traditional Saramaccan dancing and singing (with 4+ guests).",
          activities: ["Guided jungle trek", "Learn about medicinal plants and wildlife", "Swim at Tapawatra Sula waterfall", "Visit Djumu health center", "Cultural evening with dancing and music"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 3,
          title: "Return to Paramaribo",
          description: "After breakfast, depart by korjaal downstream to Atjoni (2.5 hours), enjoy lunch, then return to Paramaribo by bus (2 hours). Flight option available from Djumu airfield.",
          activities: ["Korjaal journey downstream", "Final views of river villages", "Return to Paramaribo"],
          meals: ["Breakfast", "Lunch"],
        }
      ],
      includes: [
        "Professional Dutch and English-speaking guide",
        "All activities as per daily program",
        "Three delicious meals per day, snacks, fruit, water, coffee, tea",
        "Transport to/from Pingpe (excluding airport transfers)",
        "An unforgettable experience!"
      ],
      what_to_bring: [
        "Comfortable walking shoes",
        "Swimwear and towel",
        "Light clothing (long sleeves recommended)",
        "Insect repellent",
        "Sunscreen and hat",
        "Camera (waterproof bag recommended)",
        "Personal medications"
      ],
      keywords: ["jungle tour suriname", "eco-tourism", "saramaccan culture", "tapawatra waterfall", "boven-suriname river", "authentic village", "3 day tour"],
      images: [],
      meeting_point: "Paramaribo city center (pickup between 8:00-8:30 AM)",
      max_participants: 20,
      min_participants: 2,
      difficulty_level: "easy",
      language: ["Dutch", "English"],
      is_demo: false,
      transport_options: transportOptions
    },
    {
      title: "Jungle Experience – Nature & Cultural Immersion",
      subtitle: "Enjoy the magnificent nature and experience the authentic culture of Upper Suriname!",
      tour_type: "standard",
      duration_days: 4,
      duration_hours: 96,
      price_per_person: 360,
      description: "A comprehensive 4-day journey combining pristine jungle exploration, authentic village life, school visits, and cultural immersion. Experience the Saramaccan way of life, trek through untouched rainforest, and swim in the magnificent Tapawatra waterfall.",
      day_program: [
        {
          day: 1,
          title: "Paramaribo – Jungle Resort Pingpe",
          description: "Journey from Paramaribo to Pingpe by bus and korjaal (or flight option). After arrival, settle into your lodge, swim in the river, and learn about Saramaccan culture from your guide.",
          activities: ["Travel to Pingpe", "Lodge check-in", "River swimming", "Cultural introduction"],
          meals: ["Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 2,
          title: "Jungle Trek & Village Immersion",
          description: "Morning jungle trek through pristine forest and along villagers' farmlands. Learn about medicinal plants and traditional farming methods. Afternoon visit to Pingpe and Semoisi villages, including the local elementary school where children from both villages study.",
          activities: ["Jungle trek with medicinal plant tour", "Visit farming plots", "Village walk in Pingpe and Semoisi", "School visit", "Evening korjaal tour for caiman spotting"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 3,
          title: "Granman's Village & Tapawatra Sula",
          description: "Visit Asindohopo village on the Pikin Rio, home of the Granman (paramount chief). Tour the local radio station, then journey to Tapawatra Sula for swimming and picnic lunch on the rocks. Return via Djumu health center. Evening cultural performance with traditional dancing and singing (with 4+ guests).",
          activities: ["Visit Granman's village Asindohopo", "Tour local radio station", "Swim at Tapawatra Sula", "Picnic lunch on rocks", "Visit health center", "Cultural evening performance"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 4,
          title: "Return to Paramaribo",
          description: "After breakfast, return journey to Paramaribo by korjaal and bus (or flight option).",
          activities: ["Return journey", "Final river views"],
          meals: ["Breakfast", "Lunch"],
        }
      ],
      includes: [
        "Professional Dutch and English-speaking guide",
        "All activities as per daily program",
        "Three delicious meals per day, snacks, fruit, water, coffee, tea",
        "Transport to/from Pingpe (excluding airport transfers)",
        "An unforgettable experience!"
      ],
      what_to_bring: [
        "Comfortable walking shoes",
        "Swimwear and towel",
        "Light clothing (long sleeves recommended)",
        "Insect repellent",
        "Sunscreen and hat",
        "Camera (waterproof bag recommended)",
        "Personal medications"
      ],
      keywords: ["jungle tour suriname", "cultural immersion", "village life", "school visit", "4 day tour", "saramaccan culture", "eco-tourism"],
      images: [],
      meeting_point: "Paramaribo city center (pickup between 8:00-8:30 AM)",
      max_participants: 20,
      min_participants: 2,
      difficulty_level: "moderate",
      language: ["Dutch", "English"],
      is_demo: false,
      transport_options: transportOptions
    },
    {
      title: "Back-to-Basic Expedition – Wilderness Camp Trek",
      subtitle: "Experience the untouched jungle and authentic culture of Upper Suriname with a unique Back-to-Basic experience!",
      tour_type: "back-to-basic",
      duration_days: 4,
      duration_hours: 96,
      price_per_person: 380,
      description: "Unique 4-day adventure featuring 2 days deep in pristine jungle with overnight camping at Kamp Anjoemara. Trek 4 hours into untouched rainforest, sleep in hammocks by a large creek, fish for Anjoemara, and truly disconnect from the outside world. Experience the jungle in its most authentic form.",
      day_program: [
        {
          day: 1,
          title: "Paramaribo – Jungle Resort Pingpe",
          description: "Travel from Paramaribo to Pingpe by bus/korjaal or flight. After arrival, settle in and take a village walk through Pingpe. Learn about Saramaccan culture and prepare for the back-to-basic adventure ahead.",
          activities: ["Travel to Pingpe", "Village walk", "Cultural briefing"],
          meals: ["Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 2,
          title: "Back-to-Basic Trek – Deep Jungle Camp",
          description: "After breakfast, begin your back-to-basic experience. Trek 4-5 hours deep into pristine jungle to Kamp Anjoemara, a primitive camp by a large creek. Your guide explains flora, fauna, and jungle customs. Swim in the creek, try fishing for Anjoemara, or relax in your hammock. Enjoy a campfire and the sounds of the jungle before sleeping under mosquito nets in hammocks.",
          activities: ["4-5 hour jungle trek", "Set up at Kamp Anjoemara", "Creek swimming", "Fishing for Anjoemara", "Campfire evening", "Hammock camping"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Hammock camp at Kamp Anjoemara"
        },
        {
          day: 3,
          title: "Return Trek & Tapawatra Waterfall",
          description: "After breakfast and breaking camp, trek 3-4 hours back to Pingpe village, then korjaal to the resort. After lunch, visit the magnificent Tapawatra Sula for swimming and natural massage baths. Evening cultural performance with traditional dancing and singing (with 4+ guests).",
          activities: ["3-4 hour return trek", "Korjaal to resort", "Swim at Tapawatra Sula", "Cultural evening performance"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 4,
          title: "Return to Paramaribo",
          description: "After breakfast, return journey to Paramaribo by korjaal and bus (or flight option).",
          activities: ["Return journey"],
          meals: ["Breakfast", "Lunch"],
        }
      ],
      includes: [
        "Professional Dutch and English-speaking guide",
        "All activities including back-to-basic camping",
        "Three meals per day, snacks, fruit, water, coffee, tea",
        "Camping equipment (hammocks, mosquito nets)",
        "Transport to/from Pingpe",
        "An authentic jungle experience!"
      ],
      what_to_bring: [
        "Sturdy hiking boots",
        "Swimwear and quick-dry towel",
        "Light, long-sleeved clothing",
        "Strong insect repellent",
        "Sunscreen and hat",
        "Headlamp or flashlight",
        "Personal medications",
        "Plastic bags for electronics"
      ],
      keywords: ["back to basic", "jungle camping", "wilderness trek", "anjoemara", "primitive camping", "suriname adventure", "4 day expedition"],
      images: [],
      meeting_point: "Paramaribo city center (pickup between 8:00-8:30 AM)",
      max_participants: 12,
      min_participants: 2,
      difficulty_level: "challenging",
      language: ["Dutch", "English"],
      is_demo: false,
      transport_options: transportOptions
    },
    {
      title: "Jungle Explorer – Extended Ananasberg Adventure",
      subtitle: "Discover the magnificent nature and experience the authentic culture of Upper Suriname!",
      tour_type: "standard",
      duration_days: 5,
      duration_hours: 120,
      price_per_person: 385,
      description: "Extended 5-day exploration featuring jungle treks, cultural immersion, Tapawatra waterfall, and the challenging Ananasberg mountain climb. Experience village life, visit the Granman's village, and enjoy multiple cultural performances.",
      day_program: [
        {
          day: 1,
          title: "Paramaribo – Jungle Resort Pingpe",
          description: "Journey to Pingpe by bus/korjaal or flight. After arrival, settle in and visit Pingpe village. Learn about Saramaccan culture and traditions.",
          activities: ["Travel to Pingpe", "Village walk", "Cultural introduction"],
          meals: ["Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 2,
          title: "Jungle Trek & Evening Korjaal Tour",
          description: "Morning jungle trek through pristine forest and farmlands. Learn about medicinal plants and traditional farming. Afternoon relaxation and evening korjaal tour for caiman spotting.",
          activities: ["Jungle trek", "Medicinal plant tour", "River swimming", "Evening korjaal tour"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 3,
          title: "Granman's Village & Tapawatra Sula",
          description: "Visit Asindohopo village and local radio station. Journey to Tapawatra Sula for swimming and picnic lunch. Return via health center. Evening cultural performance (with 4+ guests).",
          activities: ["Visit Asindohopo", "Tour radio station", "Swim at Tapawatra Sula", "Picnic lunch", "Cultural evening"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 4,
          title: "School Visit & Ananasberg Climb",
          description: "Morning visit to local elementary school. Afternoon climb of Ananasberg mountain for panoramic jungle views. Evening relaxation at the resort.",
          activities: ["School visit", "Ananasberg mountain climb", "Panoramic views", "Free time"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 5,
          title: "Return to Paramaribo",
          description: "After breakfast, return journey to Paramaribo by korjaal and bus (or flight option).",
          activities: ["Return journey"],
          meals: ["Breakfast", "Lunch"],
        }
      ],
      includes: [
        "Professional Dutch and English-speaking guide",
        "All activities as per daily program",
        "Three delicious meals per day, snacks, fruit, water, coffee, tea",
        "Transport to/from Pingpe",
        "An unforgettable experience!"
      ],
      what_to_bring: [
        "Sturdy walking shoes for mountain climb",
        "Swimwear and towel",
        "Light clothing (long sleeves recommended)",
        "Insect repellent",
        "Sunscreen and hat",
        "Camera",
        "Personal medications"
      ],
      keywords: ["jungle explorer", "ananasberg", "mountain climb", "5 day tour", "extended adventure", "cultural immersion", "suriname eco-tourism"],
      images: [],
      meeting_point: "Paramaribo city center (pickup between 8:00-8:30 AM)",
      max_participants: 20,
      min_participants: 2,
      difficulty_level: "moderate",
      language: ["Dutch", "English"],
      is_demo: false,
      transport_options: transportOptions
    },
    {
      title: "Back-to-Basic Expedition – Deep Forest Experience",
      subtitle: "Experience the untouched jungle and authentic culture of Upper Suriname with an extended Back-to-Basic adventure!",
      tour_type: "back-to-basic",
      duration_days: 5,
      duration_hours: 120,
      price_per_person: 410,
      description: "Extended 5-day back-to-basic adventure with 2 days of primitive jungle camping at Kamp Anjoemara. Trek deep into pristine rainforest, sleep in hammocks, fish for Anjoemara, and experience authentic jungle life. Includes Tapawatra waterfall and cultural performances.",
      day_program: [
        {
          day: 1,
          title: "Paramaribo – Jungle Resort Pingpe",
          description: "Travel to Pingpe and prepare for the back-to-basic experience ahead.",
          activities: ["Travel to Pingpe", "Cultural introduction"],
          meals: ["Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 2,
          title: "Begin Back-to-Basic Trek",
          description: "Trek 4-5 hours deep into jungle to Kamp Anjoemara. Set up primitive camp, swim, fish, and enjoy campfire.",
          activities: ["4-5 hour jungle trek", "Primitive camp setup", "Creek activities", "Campfire"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Hammock camp at Kamp Anjoemara"
        },
        {
          day: 3,
          title: "Return Trek & Cultural Evening",
          description: "Trek 3-4 hours back to resort. Afternoon relaxation. Evening cultural performance with traditional dancing (with 4+ guests).",
          activities: ["3-4 hour return trek", "Rest and relaxation", "Cultural evening"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 4,
          title: "Tapawatra Sula & Asindohopo Visit",
          description: "Visit Granman's village Asindohopo, then swim at Tapawatra Sula. Picnic lunch on the rocks.",
          activities: ["Village visit", "Swim at waterfall", "Picnic lunch"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 5,
          title: "Return to Paramaribo",
          description: "Return journey to Paramaribo.",
          activities: ["Return journey"],
          meals: ["Breakfast", "Lunch"],
        }
      ],
      includes: [
        "Professional Dutch and English-speaking guide",
        "All activities including back-to-basic camping",
        "Three meals per day, snacks, fruit, water, coffee, tea",
        "Camping equipment (hammocks, mosquito nets)",
        "Transport to/from Pingpe",
        "An authentic jungle experience!"
      ],
      what_to_bring: [
        "Sturdy hiking boots",
        "Swimwear and quick-dry towel",
        "Light, long-sleeved clothing",
        "Strong insect repellent",
        "Sunscreen and hat",
        "Headlamp or flashlight",
        "Personal medications",
        "Plastic bags for electronics"
      ],
      keywords: ["back to basic", "5 day expedition", "primitive camping", "deep forest", "wilderness adventure", "suriname jungle", "authentic experience"],
      images: [],
      meeting_point: "Paramaribo city center (pickup between 8:00-8:30 AM)",
      max_participants: 12,
      min_participants: 2,
      difficulty_level: "challenging",
      language: ["Dutch", "English"],
      is_demo: false,
      transport_options: transportOptions
    },
    {
      title: "Ultimate Back-to-Basic – 3-Day Jungle Camp",
      subtitle: "Experience the untouched jungle and authentic culture of Upper Suriname with the ultimate Back-to-Basic adventure!",
      tour_type: "back-to-basic",
      duration_days: 6,
      duration_hours: 144,
      price_per_person: 430,
      description: "Ultimate 6-day back-to-basic expedition featuring 3 days of primitive jungle camping. Trek deep into pristine rainforest, live like a true jungle explorer, and completely disconnect from civilization. Includes cultural immersion, Tapawatra waterfall, and visits to traditional villages.",
      day_program: [
        {
          day: 1,
          title: "Paramaribo – Jungle Resort Pingpe",
          description: "Travel to Pingpe and prepare for the ultimate back-to-basic experience.",
          activities: ["Travel to Pingpe", "Cultural briefing"],
          meals: ["Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 2,
          title: "Begin Ultimate Jungle Trek",
          description: "Trek 4-5 hours to Kamp Anjoemara. Set up primitive camp for 3-night stay.",
          activities: ["Deep jungle trek", "Camp setup", "Creek exploration"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Hammock camp at Kamp Anjoemara"
        },
        {
          day: 3,
          title: "Jungle Immersion Day",
          description: "Full day in jungle. Extended trek with guide learning about medicinal plants, swimming in rapids, fishing for Anjoemara, or relaxing at creek.",
          activities: ["Extended jungle trek", "Medicinal plant study", "Creek swimming", "Fishing", "Campfire stories"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Hammock camp at Kamp Anjoemara"
        },
        {
          day: 4,
          title: "Return Trek & Cultural Evening",
          description: "Trek 3-4 hours back to resort. Evening cultural performance with traditional Saramaccan dancing and singing (with 4+ guests).",
          activities: ["Return trek", "Resort arrival", "Cultural evening performance"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 5,
          title: "Tapawatra Sula & Asindohopo",
          description: "Visit Granman's village Asindohopo and tour local facilities. Journey to Tapawatra Sula for swimming and picnic lunch on the rocks.",
          activities: ["Village visit", "Waterfall swimming", "Picnic lunch", "Health center visit"],
          meals: ["Breakfast", "Lunch", "Dinner"],
          accommodation: "Jungle Resort Pingpe Lodge"
        },
        {
          day: 6,
          title: "Return to Paramaribo",
          description: "Final breakfast and return journey to Paramaribo.",
          activities: ["Return journey", "Final goodbyes"],
          meals: ["Breakfast", "Lunch"],
        }
      ],
      includes: [
        "Professional Dutch and English-speaking guide",
        "Ultimate 3-day back-to-basic camping experience",
        "Three meals per day, snacks, fruit, water, coffee, tea",
        "All camping equipment (hammocks, mosquito nets)",
        "Transport to/from Pingpe",
        "The adventure of a lifetime!"
      ],
      what_to_bring: [
        "Sturdy hiking boots (broken in)",
        "Swimwear and quick-dry towel",
        "Light, long-sleeved clothing",
        "Strong insect repellent",
        "Sunscreen and hat",
        "Headlamp or flashlight with extra batteries",
        "Personal medications",
        "Waterproof bags for all electronics",
        "Small backpack for jungle treks"
      ],
      keywords: ["ultimate adventure", "6 day expedition", "3 day camping", "deep jungle", "wilderness survival", "suriname extreme", "back to basic", "primitive living"],
      images: [],
      meeting_point: "Paramaribo city center (pickup between 8:00-8:30 AM)",
      max_participants: 10,
      min_participants: 2,
      difficulty_level: "challenging",
      language: ["Dutch", "English"],
      is_demo: false,
      transport_options: transportOptions
    },
    {
      title: "Brownsberg & Ston Island Combo Tour",
      subtitle: "Combine Brownsberg Nature Park and Brokopondo Lake with Jungle Resort Pingpe for the perfect nature adventure!",
      tour_type: "combination",
      duration_days: 2,
      duration_hours: 48,
      price_per_person: 145,
      description: "Perfect 2-day combination tour featuring Brownsberg Nature Park's stunning waterfalls, panoramic views from Mazaroni Plateau, and the serene Ston Island on Brokopondo Lake. Ideal for nature lovers and active hikers. Can be combined with longer Pingpe tours.",
      day_program: [
        {
          day: 1,
          title: "Paramaribo – Brownsberg – Ston Island",
          description: "Early morning pickup from Paramaribo. Drive 2 hours to Brownsberg, then ascend the steep road to Mazaroni Plateau (500m above sea level). Enjoy breathtaking views over Brokopondo Lake. Trek to Leo and Irene waterfalls through pristine rainforest. After lunch, walk to the viewpoint. Evening transfer to Ston Island peninsula where you'll overnight in rooms with shower and toilet. Enjoy sunset over the lake.",
          activities: ["Drive to Brownsberg", "Mazaroni Plateau viewpoint", "Trek to Leo and Irene waterfalls", "Transfer to Ston Island", "Sunset viewing"],
          meals: ["Snack", "Lunch", "Dinner"],
          accommodation: "Ston Island rooms with facilities"
        },
        {
          day: 2,
          title: "Ston Island – Atjoni or Paramaribo",
          description: "Wake to jungle sounds, enjoy breakfast, swim in the lake, or try fishing. If continuing to Jungle Resort Pingpe, depart around 10:30 AM to Atjoni harbor, then take boat to Pingpe. If ending tour (with 4+ persons), enjoy boat trip on Brokopondo Lake between tree tops from the dam, late lunch, and return to Paramaribo by 6:00 PM.",
          activities: ["Morning swimming or fishing", "Boat trip on Brokopondo Lake (4+ persons)", "Transfer to Atjoni/Paramaribo"],
          meals: ["Breakfast", "Lunch"],
        }
      ],
      includes: [
        "Professional Dutch and English-speaking guide",
        "All activities as per program",
        "Meals as specified",
        "Accommodation at Ston Island",
        "Transport from/to Paramaribo or Atjoni",
        "Entrance fees to Brownsberg Nature Park"
      ],
      what_to_bring: [
        "Sturdy hiking boots",
        "Swimwear and towel",
        "Light clothing",
        "Insect repellent",
        "Sunscreen and hat",
        "Camera",
        "Personal medications"
      ],
      keywords: ["brownsberg", "ston island", "brokopondo lake", "nature park", "combination tour", "waterfalls", "suriname combo", "2 day tour"],
      images: [],
      meeting_point: "Paramaribo city center (pickup around 7:30 AM)",
      max_participants: 20,
      min_participants: 2,
      difficulty_level: "moderate",
      language: ["Dutch", "English"],
      is_demo: false,
      transport_options: [
        {
          type: 'default',
          name: 'Standard Transport',
          description: 'Round trip Paramaribo-Brownsberg-Ston Island-Paramaribo or continuation to Atjoni',
          included: true
        },
        {
          type: 'boat-tour-addon',
          name: 'Brokopondo Lake Boat Tour',
          description: 'Boat trip on Brokopondo Lake from dam (included with 4+ persons, €50 surcharge for 2-3 persons)',
          surcharge_note: '€50 per group for 2-3 persons; included for 4+ persons'
        }
      ]
    }
  ];

  try {
    for (const tour of tours) {
      const { data, error } = await supabase
        .from('experiences')
        .insert([{
          title: tour.title,
          description: tour.description,
          duration_hours: tour.duration_hours,
          duration_days: tour.duration_days,
          price_per_person: tour.price_per_person,
          max_participants: tour.max_participants,
          min_participants: tour.min_participants,
          difficulty_level: tour.difficulty_level,
          meeting_point: tour.meeting_point,
          includes: tour.includes,
          what_to_bring: tour.what_to_bring,
          language: tour.language,
          images: tour.images,
          day_program: tour.day_program as any,
          tour_type: tour.tour_type,
          keywords: tour.keywords,
          is_demo: tour.is_demo,
          transport_options: tour.transport_options as any,
          host_id: userId,
          is_active: true,
        }])
        .select();

      if (error) {
        errors.push(`Failed to import "${tour.title}": ${error.message}`);
      } else {
        successCount++;
      }
    }

    return {
      success: errors.length === 0,
      message: errors.length === 0
        ? `Successfully imported ${successCount} official PingPe tours`
        : `Imported ${successCount} tours with ${errors.length} errors`,
      counts: { tours: successCount },
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Import failed',
      errors: [error.message],
    };
  }
}

export async function clearDemoTours(): Promise<ImportResult> {
  try {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('is_demo', true);

    if (error) throw error;

    return {
      success: true,
      message: 'Demo tours cleared successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to clear demo tours',
      errors: [error.message],
    };
  }
}
