export type EventStatus = 'active' | 'full' | 'cancelled' | 'completed'
export type AttendeeStatus = 'going' | 'maybe' | 'interested' | 'waitlist'
export type Difficulty = 'easy' | 'moderate' | 'hard'
export type EventCategory = 'outdoor_adventure' | 'hiking' | 'camping' | 'climbing'

export interface Event {
  id: string
  organizer_id: string
  title: string
  description?: string
  category: EventCategory
  event_date: string
  start_time: string
  end_time: string
  location_name: string
  location_address: string
  location_lat?: number
  location_lng?: number
  max_capacity: number
  current_capacity: number
  difficulty?: Difficulty
  elevation?: number
  pricing_type: 'free' | 'paid'
  price?: number
  visibility: 'public' | 'private'
  status: EventStatus
  hero_image_url?: string
  created_at: string
  updated_at: string
}

export interface EventAttendee {
  id: string
  event_id: string
  user_id: string
  status: AttendeeStatus
  responded_at: string
  waitlist_position?: number
  waitlist_notified_at?: string
  waitlist_expires_at?: string
  created_at: string
}

export interface PackingListItem {
  id: string
  event_id: string
  item_name: string
  claimed_by?: string
  claimed_at?: string
  created_at: string
}
