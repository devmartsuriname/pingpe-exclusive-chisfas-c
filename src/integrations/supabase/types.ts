export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          category: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      availability: {
        Row: {
          booked: number | null
          capacity: number | null
          created_at: string | null
          date: string
          id: string
          inventory_id: string
          inventory_type: Database["public"]["Enums"]["inventory_type"]
          is_blocked: boolean | null
          notes: string | null
          price_override: number | null
        }
        Insert: {
          booked?: number | null
          capacity?: number | null
          created_at?: string | null
          date: string
          id?: string
          inventory_id: string
          inventory_type: Database["public"]["Enums"]["inventory_type"]
          is_blocked?: boolean | null
          notes?: string | null
          price_override?: number | null
        }
        Update: {
          booked?: number | null
          capacity?: number | null
          created_at?: string | null
          date?: string
          id?: string
          inventory_id?: string
          inventory_type?: Database["public"]["Enums"]["inventory_type"]
          is_blocked?: boolean | null
          notes?: string | null
          price_override?: number | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "blog_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          body: string
          category_id: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          seo_meta: Json | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          body: string
          category_id?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          seo_meta?: Json | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          body?: string
          category_id?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          seo_meta?: Json | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      booking_items: {
        Row: {
          booking_id: string
          date: string | null
          id: string
          inventory_id: string
          inventory_type: Database["public"]["Enums"]["inventory_type"]
          notes: string | null
          price_per_unit: number
          quantity: number | null
          subtotal: number
        }
        Insert: {
          booking_id: string
          date?: string | null
          id?: string
          inventory_id: string
          inventory_type: Database["public"]["Enums"]["inventory_type"]
          notes?: string | null
          price_per_unit: number
          quantity?: number | null
          subtotal: number
        }
        Update: {
          booking_id?: string
          date?: string | null
          id?: string
          inventory_id?: string
          inventory_type?: Database["public"]["Enums"]["inventory_type"]
          notes?: string | null
          price_per_unit?: number
          quantity?: number | null
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          check_in: string
          check_out: string
          created_at: string | null
          guest_id: string
          guests: number
          id: string
          inventory_id: string | null
          inventory_type: Database["public"]["Enums"]["inventory_type"] | null
          property_id: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          updated_at: string | null
        }
        Insert: {
          check_in: string
          check_out: string
          created_at?: string | null
          guest_id: string
          guests: number
          id?: string
          inventory_id?: string | null
          inventory_type?: Database["public"]["Enums"]["inventory_type"] | null
          property_id: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price: number
          updated_at?: string | null
        }
        Update: {
          check_in?: string
          check_out?: string
          created_at?: string | null
          guest_id?: string
          guests?: number
          id?: string
          inventory_id?: string | null
          inventory_type?: Database["public"]["Enums"]["inventory_type"] | null
          property_id?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          duration_hours: number | null
          event_date: string
          id: string
          images: string[] | null
          includes: string[] | null
          is_active: boolean | null
          latitude: number | null
          location: string
          longitude: number | null
          max_attendees: number | null
          organizer_id: string
          price_per_person: number
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          event_date: string
          id?: string
          images?: string[] | null
          includes?: string[] | null
          is_active?: boolean | null
          latitude?: number | null
          location: string
          longitude?: number | null
          max_attendees?: number | null
          organizer_id: string
          price_per_person: number
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          event_date?: string
          id?: string
          images?: string[] | null
          includes?: string[] | null
          is_active?: boolean | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          max_attendees?: number | null
          organizer_id?: string
          price_per_person?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          age_restriction: number | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          duration_hours: number
          host_id: string
          id: string
          images: string[] | null
          includes: string[] | null
          is_active: boolean | null
          language: string[] | null
          latitude: number | null
          longitude: number | null
          max_participants: number
          meeting_point: string
          min_participants: number | null
          price_per_person: number
          title: string
          updated_at: string | null
          what_to_bring: string[] | null
        }
        Insert: {
          age_restriction?: number | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours: number
          host_id: string
          id?: string
          images?: string[] | null
          includes?: string[] | null
          is_active?: boolean | null
          language?: string[] | null
          latitude?: number | null
          longitude?: number | null
          max_participants: number
          meeting_point: string
          min_participants?: number | null
          price_per_person: number
          title: string
          updated_at?: string | null
          what_to_bring?: string[] | null
        }
        Update: {
          age_restriction?: number | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          duration_hours?: number
          host_id?: string
          id?: string
          images?: string[] | null
          includes?: string[] | null
          is_active?: boolean | null
          language?: string[] | null
          latitude?: number | null
          longitude?: number | null
          max_participants?: number
          meeting_point?: string
          min_participants?: number | null
          price_per_person?: number
          title?: string
          updated_at?: string | null
          what_to_bring?: string[] | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      media_library: {
        Row: {
          alt_text: string | null
          created_at: string
          file_size: number
          file_type: string
          folder: string | null
          height: number | null
          id: string
          name: string
          tags: string[] | null
          thumbnail_url: string | null
          updated_at: string
          uploaded_by: string
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          file_size: number
          file_type: string
          folder?: string | null
          height?: number | null
          id?: string
          name: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_by: string
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          file_size?: number
          file_type?: string
          folder?: string | null
          height?: number | null
          id?: string
          name?: string
          tags?: string[] | null
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_by?: string
          url?: string
          width?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          booking_id: string
          content: string
          created_at: string | null
          id: string
          sender_id: string
        }
        Insert: {
          booking_id: string
          content: string
          created_at?: string | null
          id?: string
          sender_id: string
        }
        Update: {
          booking_id?: string
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          booking_id: string | null
          channel: string | null
          error_message: string | null
          external_id: string | null
          id: string
          message: string
          sent_at: string | null
          status: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          channel?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          message: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string | null
          channel?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          message?: string
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      package_items: {
        Row: {
          day_number: number | null
          inventory_id: string
          inventory_type: Database["public"]["Enums"]["inventory_type"]
          notes: string | null
          package_id: string
          quantity: number | null
        }
        Insert: {
          day_number?: number | null
          inventory_id: string
          inventory_type: Database["public"]["Enums"]["inventory_type"]
          notes?: string | null
          package_id: string
          quantity?: number | null
        }
        Update: {
          day_number?: number | null
          inventory_id?: string
          inventory_type?: Database["public"]["Enums"]["inventory_type"]
          notes?: string | null
          package_id?: string
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "package_items_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          creator_id: string
          description: string | null
          discount_percentage: number | null
          duration_days: number
          id: string
          images: string[] | null
          includes_summary: string[] | null
          is_active: boolean | null
          max_participants: number
          price_total: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          description?: string | null
          discount_percentage?: number | null
          duration_days: number
          id?: string
          images?: string[] | null
          includes_summary?: string[] | null
          is_active?: boolean | null
          max_participants: number
          price_total: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          description?: string | null
          discount_percentage?: number | null
          duration_days?: number
          id?: string
          images?: string[] | null
          includes_summary?: string[] | null
          is_active?: boolean | null
          max_participants?: number
          price_total?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_bookings: {
        Row: {
          booking_id: string
          commission_amount: number
          commission_paid: boolean | null
          commission_paid_date: string | null
          notes: string | null
          partner_id: string
        }
        Insert: {
          booking_id: string
          commission_amount: number
          commission_paid?: boolean | null
          commission_paid_date?: string | null
          notes?: string | null
          partner_id: string
        }
        Update: {
          booking_id?: string
          commission_amount?: number
          commission_paid?: boolean | null
          commission_paid_date?: string | null
          notes?: string | null
          partner_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_bookings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_bookings_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          address: string | null
          commission_rate: number
          contact_email: string
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          payment_terms: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          commission_rate: number
          contact_email: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          payment_terms?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          commission_rate?: number
          contact_email?: string
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          payment_terms?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string | null
          id: string
          payment_method: string
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          paypal_payment_id: string | null
          stripe_payment_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string | null
          id?: string
          payment_method: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          paypal_payment_id?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string | null
          id?: string
          payment_method?: string
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          paypal_payment_id?: string | null
          stripe_payment_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      price_rules: {
        Row: {
          created_at: string | null
          date_end: string | null
          date_start: string | null
          day_of_week: number[] | null
          discount_fixed: number | null
          discount_percentage: number | null
          id: string
          inventory_id: string
          inventory_type: Database["public"]["Enums"]["inventory_type"]
          is_active: boolean | null
          max_participants: number | null
          min_participants: number | null
          price_multiplier: number | null
          priority: number | null
          promo_code: string | null
          rule_name: string
          rule_type: string | null
        }
        Insert: {
          created_at?: string | null
          date_end?: string | null
          date_start?: string | null
          day_of_week?: number[] | null
          discount_fixed?: number | null
          discount_percentage?: number | null
          id?: string
          inventory_id: string
          inventory_type: Database["public"]["Enums"]["inventory_type"]
          is_active?: boolean | null
          max_participants?: number | null
          min_participants?: number | null
          price_multiplier?: number | null
          priority?: number | null
          promo_code?: string | null
          rule_name: string
          rule_type?: string | null
        }
        Update: {
          created_at?: string | null
          date_end?: string | null
          date_start?: string | null
          day_of_week?: number[] | null
          discount_fixed?: number | null
          discount_percentage?: number | null
          id?: string
          inventory_id?: string
          inventory_type?: Database["public"]["Enums"]["inventory_type"]
          is_active?: boolean | null
          max_participants?: number | null
          min_participants?: number | null
          price_multiplier?: number | null
          priority?: number | null
          promo_code?: string | null
          rule_name?: string
          rule_type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string
          bathrooms: number
          bedrooms: number
          beds: number
          city: string
          country: string
          created_at: string | null
          description: string | null
          guests: number
          host_id: string
          id: string
          images: string[] | null
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          price_per_night: number
          property_type: Database["public"]["Enums"]["property_type"]
          title: string
          updated_at: string | null
        }
        Insert: {
          address: string
          bathrooms?: number
          bedrooms?: number
          beds?: number
          city: string
          country: string
          created_at?: string | null
          description?: string | null
          guests?: number
          host_id: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          price_per_night: number
          property_type: Database["public"]["Enums"]["property_type"]
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          bathrooms?: number
          bedrooms?: number
          beds?: number
          city?: string
          country?: string
          created_at?: string | null
          description?: string | null
          guests?: number
          host_id?: string
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          price_per_night?: number
          property_type?: Database["public"]["Enums"]["property_type"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      property_amenities: {
        Row: {
          amenity_id: string
          property_id: string
        }
        Insert: {
          amenity_id: string
          property_id: string
        }
        Update: {
          amenity_id?: string
          property_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_amenities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      refunds: {
        Row: {
          amount: number
          approved_by: string | null
          booking_id: string
          created_at: string | null
          id: string
          notes: string | null
          payment_id: string | null
          processed_at: string | null
          reason: string
          refund_method: string | null
          requested_by: string | null
          status: string | null
          updated_at: string | null
          voucher_code: string | null
          voucher_expires_at: string | null
        }
        Insert: {
          amount: number
          approved_by?: string | null
          booking_id: string
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_id?: string | null
          processed_at?: string | null
          reason: string
          refund_method?: string | null
          requested_by?: string | null
          status?: string | null
          updated_at?: string | null
          voucher_code?: string | null
          voucher_expires_at?: string | null
        }
        Update: {
          amount?: number
          approved_by?: string | null
          booking_id?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          payment_id?: string | null
          processed_at?: string | null
          reason?: string
          refund_method?: string | null
          requested_by?: string | null
          status?: string | null
          updated_at?: string | null
          voucher_code?: string | null
          voucher_expires_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "refunds_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refunds_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string | null
          id: string
          property_id: string
          rating: number
          reviewer_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string | null
          id?: string
          property_id: string
          rating: number
          reviewer_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string | null
          id?: string
          property_id?: string
          rating?: number
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      transport: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string | null
          description: string | null
          duration_hours: number | null
          id: string
          images: string[] | null
          is_active: boolean | null
          luggage_allowance: string | null
          price_per_group: number | null
          price_per_person: number
          provider_id: string
          route_from: string
          route_to: string
          title: string
          updated_at: string | null
          vehicle_type: string
        }
        Insert: {
          amenities?: string[] | null
          capacity: number
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          luggage_allowance?: string | null
          price_per_group?: number | null
          price_per_person: number
          provider_id: string
          route_from: string
          route_to: string
          title: string
          updated_at?: string | null
          vehicle_type: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          luggage_allowance?: string | null
          price_per_group?: number | null
          price_per_person?: number
          provider_id?: string
          route_from?: string
          route_to?: string
          title?: string
          updated_at?: string | null
          vehicle_type?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "host" | "guest"
      booking_status:
        | "pending"
        | "confirmed"
        | "cancelled"
        | "completed"
        | "payment_intent"
        | "pending_approval"
        | "refunded"
      inventory_type: "stay" | "experience" | "transport" | "package" | "event"
      payment_status: "pending" | "paid" | "refunded" | "failed"
      property_type:
        | "hotel"
        | "apartment"
        | "villa"
        | "cabin"
        | "cottage"
        | "house"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "host", "guest"],
      booking_status: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "payment_intent",
        "pending_approval",
        "refunded",
      ],
      inventory_type: ["stay", "experience", "transport", "package", "event"],
      payment_status: ["pending", "paid", "refunded", "failed"],
      property_type: [
        "hotel",
        "apartment",
        "villa",
        "cabin",
        "cottage",
        "house",
      ],
    },
  },
} as const
