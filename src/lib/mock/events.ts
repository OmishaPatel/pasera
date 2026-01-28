// Mock event data for Phase 4 development
// TODO: Phase 5 - Replace with Supabase queries

import { Event, EventWithOrganizer } from '@/types/event';
import { mockUsers } from './users';

export const mockEvents: EventWithOrganizer[] = [
  {
    id: 'event-1',
    title: 'Runyon Canyon Sunrise Hike',
    description: 'Join us for a beautiful sunrise hike at Runyon Canyon! We\'ll meet at the main entrance and hike to the summit to catch the sunrise over Los Angeles. Perfect for all skill levels. Bring water, comfortable shoes, and a camera!',
    category: 'hiking',
    event_date: '2026-06-15',
    start_time: '06:00:00',
    end_time: '09:00:00',
    location_name: 'Runyon Canyon Park',
    location_address: '2000 N Fuller Ave, Los Angeles, CA 90046',
    location_lat: 34.1103,
    location_lng: -118.3553,
    max_capacity: 20,
    current_capacity: 15,
    difficulty: 'moderate',
    pricing_type: 'free',
    visibility: 'public',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80',
    organizer_id: 'user-1',
    packing_list_notes: 'Water bottle, comfortable hiking shoes, light jacket, camera (optional), sunscreen',
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z',
    organizer: mockUsers[0],
  },
  {
    id: 'event-2',
    title: 'Santa Monica Beach Yoga Session',
    description: 'Start your day with a refreshing beach yoga session. Suitable for all levels, from beginners to advanced practitioners. Bring your own mat and towel. We\'ll practice mindful breathing and sun salutations as the waves roll in.',
    category: 'outdoor_adventure',
    event_date: '2026-06-20',
    start_time: '07:00:00',
    end_time: '08:30:00',
    location_name: 'Santa Monica Beach',
    location_address: '1600 Ocean Front Walk, Santa Monica, CA 90401',
    location_lat: 34.0195,
    location_lng: -118.4912,
    max_capacity: 15,
    current_capacity: 15,
    difficulty: 'easy',
    pricing_type: 'free',
    visibility: 'public',
    status: 'full',
    hero_image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    organizer_id: 'user-3',
    packing_list_notes: 'Yoga mat, towel, water bottle, comfortable athletic wear',
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-25T00:00:00Z',
    organizer: mockUsers[2],
  },
  {
    id: 'event-3',
    title: 'Griffith Observatory Star Gazing',
    description: 'Explore the night sky with fellow astronomy enthusiasts! We\'ll use telescopes to observe planets, stars, and constellations. Perfect for families and anyone curious about the cosmos. Free parking available after 7 PM.',
    category: 'other',
    event_date: '2026-07-01',
    start_time: '20:00:00',
    end_time: '22:00:00',
    location_name: 'Griffith Observatory',
    location_address: '2800 E Observatory Rd, Los Angeles, CA 90027',
    location_lat: 34.1184,
    location_lng: -118.3004,
    max_capacity: 25,
    current_capacity: 10,
    difficulty: 'easy',
    pricing_type: 'free',
    visibility: 'public',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80',
    organizer_id: 'user-1',
    packing_list_notes: 'Warm jacket, flashlight with red filter, binoculars (optional)',
    created_at: '2026-01-20T00:00:00Z',
    updated_at: '2026-01-20T00:00:00Z',
    organizer: mockUsers[0],
  },
  {
    id: 'event-4',
    title: 'Malibu Creek State Park Bike Ride',
    description: 'Join us for a scenic mountain bike ride through Malibu Creek State Park. This 12-mile loop features moderate terrain with beautiful views of the Santa Monica Mountains. Intermediate level riders welcome.',
    category: 'biking',
    event_date: '2026-06-22',
    start_time: '09:00:00',
    end_time: '12:00:00',
    location_name: 'Malibu Creek State Park',
    location_address: '1925 Las Virgenes Rd, Calabasas, CA 91302',
    location_lat: 34.0986,
    location_lng: -118.7323,
    max_capacity: 18,
    current_capacity: 12,
    difficulty: 'moderate',
    pricing_type: 'free',
    visibility: 'public',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1544191696-102dbdaeeaa0?w=1200&q=80',
    organizer_id: 'user-7',
    packing_list_notes: 'Mountain bike, helmet (required), water, snacks, first aid kit',
    created_at: '2026-01-22T00:00:00Z',
    updated_at: '2026-01-22T00:00:00Z',
    organizer: mockUsers[6],
  },
  {
    id: 'event-5',
    title: 'Point Dume Coastal Hike & Picnic',
    description: 'Experience breathtaking ocean views on this coastal hike to Point Dume. We\'ll hike the bluff trail, explore tide pools, and enjoy a picnic lunch on the beach. Bring your own lunch or purchase from nearby cafes.',
    category: 'hiking',
    event_date: '2026-07-05',
    start_time: '10:00:00',
    end_time: '14:00:00',
    location_name: 'Point Dume State Beach',
    location_address: '7103 Westward Beach Rd, Malibu, CA 90265',
    location_lat: 34.0006,
    location_lng: -118.8073,
    max_capacity: 30,
    current_capacity: 8,
    difficulty: 'easy',
    pricing_type: 'free',
    visibility: 'public',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&q=80',
    organizer_id: 'user-3',
    packing_list_notes: 'Hiking shoes, sunscreen, hat, picnic lunch, beach blanket, swimsuit (optional)',
    created_at: '2026-01-23T00:00:00Z',
    updated_at: '2026-01-23T00:00:00Z',
    organizer: mockUsers[2],
  },
  {
    id: 'event-6',
    title: 'Outdoor Rock Climbing at Stoney Point',
    description: 'Beginner-friendly outdoor rock climbing session! Experienced climbers will provide instruction and supervision. All equipment provided. Great introduction to outdoor climbing in a safe, supportive environment.',
    category: 'climbing',
    event_date: '2026-06-28',
    start_time: '08:00:00',
    end_time: '12:00:00',
    location_name: 'Stoney Point Park',
    location_address: '10300 Topanga Canyon Blvd, Chatsworth, CA 91311',
    location_lat: 34.2686,
    location_lng: -118.5962,
    max_capacity: 12,
    current_capacity: 12,
    difficulty: 'moderate',
    pricing_type: 'free',
    visibility: 'public',
    status: 'full',
    hero_image_url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=1200&q=80',
    organizer_id: 'user-7',
    packing_list_notes: 'Closed-toe athletic shoes, comfortable clothes, water, snacks, chalk bag (if you have)',
    created_at: '2026-01-24T00:00:00Z',
    updated_at: '2026-01-26T00:00:00Z',
    organizer: mockUsers[6],
  },
  {
    id: 'event-7',
    title: 'Weekend Camping at Leo Carrillo',
    description: 'Two-day camping trip at beautiful Leo Carrillo State Park. Enjoy beach access, hiking trails, and campfire gatherings. Families welcome! Reserve your spot early. Camping gear and food not provided.',
    category: 'camping',
    event_date: '2026-07-12',
    start_time: '14:00:00',
    end_time: '12:00:00',
    location_name: 'Leo Carrillo State Park',
    location_address: '35000 W Pacific Coast Hwy, Malibu, CA 90265',
    location_lat: 34.0486,
    location_lng: -118.9378,
    max_capacity: 40,
    current_capacity: 22,
    difficulty: 'easy',
    pricing_type: 'free',
    visibility: 'public',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=80',
    organizer_id: 'user-1',
    packing_list_notes: 'Tent, sleeping bag, camping stove, food, water, flashlight, warm clothes, beach gear',
    created_at: '2026-01-25T00:00:00Z',
    updated_at: '2026-01-25T00:00:00Z',
    organizer: mockUsers[0],
  },
  {
    id: 'event-8',
    title: 'Solstice Canyon Waterfall Hike',
    description: 'Discover the hidden waterfall in Solstice Canyon! This 3-mile roundtrip hike features a seasonal waterfall, historic ruins, and shaded creek-side trails. Perfect for summer hiking.',
    category: 'hiking',
    event_date: '2026-06-25',
    start_time: '09:00:00',
    end_time: '12:00:00',
    location_name: 'Solstice Canyon',
    location_address: '3455 Solstice Canyon Rd, Malibu, CA 90265',
    location_lat: 34.0343,
    location_lng: -118.7390,
    max_capacity: 20,
    current_capacity: 18,
    difficulty: 'easy',
    pricing_type: 'free',
    visibility: 'public',
    status: 'active',
    hero_image_url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=1200&q=80',
    organizer_id: 'user-3',
    packing_list_notes: 'Hiking shoes, water bottle, sunscreen, hat, camera',
    created_at: '2026-01-26T00:00:00Z',
    updated_at: '2026-01-26T00:00:00Z',
    organizer: mockUsers[2],
  },
];

// Utility functions (same names as future Supabase queries)
export const getEventById = (id: string): EventWithOrganizer | undefined =>
  mockEvents.find(e => e.id === id);

export const getUpcomingEvents = (): EventWithOrganizer[] =>
  mockEvents.filter(e => new Date(e.event_date) > new Date()).sort((a, b) =>
    new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
  );

export const getEventsByStatus = (status: 'active' | 'full' | 'cancelled'): EventWithOrganizer[] =>
  mockEvents.filter(e => e.status === status);

export const getEventsByOrganizer = (organizerId: string): EventWithOrganizer[] =>
  mockEvents.filter(e => e.organizer_id === organizerId);

export const searchEvents = (query: string): EventWithOrganizer[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockEvents.filter(e =>
    e.title.toLowerCase().includes(lowercaseQuery) ||
    e.description.toLowerCase().includes(lowercaseQuery) ||
    e.location_name.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterEventsByCategory = (category: string): EventWithOrganizer[] =>
  category === 'all' ? mockEvents : mockEvents.filter(e => e.category === category);

// Simulate async data fetching (for Phase 5 transition)
export const fetchEvents = async (): Promise<EventWithOrganizer[]> => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return mockEvents;
};

export const fetchEventById = async (id: string): Promise<EventWithOrganizer | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return getEventById(id) || null;
};

export const fetchUpcomingEvents = async (): Promise<EventWithOrganizer[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return getUpcomingEvents();
};
