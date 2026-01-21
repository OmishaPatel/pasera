// ============================================
// OutdoorPath TypeScript Type Definitions
// Event-related types for the application
// ============================================

/**
 * Event Status Types
 * - active: Event is open for RSVPs
 * - full: Event has reached max capacity
 * - cancelled: Event was cancelled by organizer
 * - completed: Event has passed
 */
export type EventStatus = 'active' | 'full' | 'cancelled' | 'completed'

/**
 * Attendee Status Types
 * - going: Confirmed attendance
 * - maybe: Tentative attendance
 * - interested: Interested but not committed
 * - waitlist: On waitlist for full event
 */
export type AttendeeStatus = 'going' | 'maybe' | 'interested' | 'waitlist'

/**
 * Difficulty Levels for outdoor activities
 */
export type Difficulty = 'easy' | 'moderate' | 'hard'

/**
 * Event Categories
 */
export type EventCategory =
  | 'outdoor_adventure'
  | 'hiking'
  | 'camping'
  | 'climbing'
  | 'biking'
  | 'kayaking'
  | 'skiing'
  | 'other'

/**
 * Main Event Interface
 * Represents a single outdoor event
 */
export interface Event {
  // Identifiers
  id: string
  organizer_id: string

  // Basic Information
  title: string
  description?: string
  category: EventCategory

  // Date & Time
  event_date: string  // ISO date format: YYYY-MM-DD
  start_time: string  // Time format: HH:MM:SS
  end_time: string    // Time format: HH:MM:SS

  // Location
  location_name: string
  location_address: string
  location_lat?: number   // Latitude for map display
  location_lng?: number   // Longitude for map display

  // Capacity
  max_capacity: number
  current_capacity: number

  // Activity Details
  difficulty?: Difficulty
  elevation?: number  // in feet

  // Pricing
  pricing_type: 'free' | 'paid'
  price?: number

  // Settings
  visibility: 'public' | 'private'
  status: EventStatus

  // Media
  hero_image_url?: string

  // Packing List (MVP: Simple text field)
  packing_list_notes?: string  // e.g., "Water bottles, Trail snacks, First aid kit"

  // Timestamps
  created_at: string
  updated_at: string
}

/**
 * Event Attendee Interface
 * Represents a user's RSVP to an event
 */
export interface EventAttendee {
  // Identifiers
  id: string
  event_id: string
  user_id: string

  // Status
  status: AttendeeStatus
  responded_at: string

  // Waitlist Management
  waitlist_position?: number
  waitlist_notified_at?: string  // When user was notified of open spot
  waitlist_expires_at?: string   // 2-hour claim window deadline

  // Timestamp
  created_at: string
}

/**
 * Event with Organizer Info
 * Extended type that includes organizer profile data
 * Useful for displaying event cards with organizer details
 */
export interface EventWithOrganizer extends Event {
  organizer: {
    id: string
    full_name: string
    avatar_url?: string
  }
}

/**
 * Event with Attendee Count
 * Extended type that includes attendee statistics
 * Useful for event listings
 */
export interface EventWithStats extends Event {
  attendee_counts: {
    going: number
    maybe: number
    interested: number
    waitlist: number
  }
}
