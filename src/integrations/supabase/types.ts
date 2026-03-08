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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      daily_schedules: {
        Row: {
          created_at: string
          crop_name: string
          district: string
          farmer_name: string
          id: string
          location: string
          schedule_data: Json
          soil_type: string | null
          start_date: string
          state: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          crop_name: string
          district: string
          farmer_name: string
          id?: string
          location: string
          schedule_data: Json
          soil_type?: string | null
          start_date: string
          state: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          crop_name?: string
          district?: string
          farmer_name?: string
          id?: string
          location?: string
          schedule_data?: Json
          soil_type?: string | null
          start_date?: string
          state?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          ai_analysis: string | null
          ai_suggestions: string[] | null
          author_id: string | null
          author_location: string
          author_name: string
          category: string
          content: string
          created_at: string
          guest_session_id: string | null
          id: string
          is_guest_post: boolean | null
          likes_count: number | null
          replies_count: number | null
          status: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_analysis?: string | null
          ai_suggestions?: string[] | null
          author_id?: string | null
          author_location: string
          author_name: string
          category: string
          content: string
          created_at?: string
          guest_session_id?: string | null
          id?: string
          is_guest_post?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          status?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_analysis?: string | null
          ai_suggestions?: string[] | null
          author_id?: string | null
          author_location?: string
          author_name?: string
          category?: string
          content?: string
          created_at?: string
          guest_session_id?: string | null
          id?: string
          is_guest_post?: boolean | null
          likes_count?: number | null
          replies_count?: number | null
          status?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          author_id: string | null
          author_name: string
          content: string
          created_at: string
          guest_session_id: string | null
          id: string
          is_guest_reply: boolean | null
          likes_count: number | null
          post_id: string | null
        }
        Insert: {
          author_id?: string | null
          author_name: string
          content: string
          created_at?: string
          guest_session_id?: string | null
          id?: string
          is_guest_reply?: boolean | null
          likes_count?: number | null
          post_id?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string
          content?: string
          created_at?: string
          guest_session_id?: string | null
          id?: string
          is_guest_reply?: boolean | null
          likes_count?: number | null
          post_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      job_profiles: {
        Row: {
          availability: boolean | null
          bank_account: string | null
          created_at: string
          description: string | null
          district: string
          expected_wage_max: number
          expected_wage_min: number
          experience_years: number | null
          government_id: string | null
          id: string
          location: string
          name: string
          phone: string
          pincode: string | null
          profile_image: string | null
          skills: string[]
          specialization: string | null
          state: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          availability?: boolean | null
          bank_account?: string | null
          created_at?: string
          description?: string | null
          district: string
          expected_wage_max: number
          expected_wage_min: number
          experience_years?: number | null
          government_id?: string | null
          id?: string
          location: string
          name: string
          phone: string
          pincode?: string | null
          profile_image?: string | null
          skills?: string[]
          specialization?: string | null
          state: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          availability?: boolean | null
          bank_account?: string | null
          created_at?: string
          description?: string | null
          district?: string
          expected_wage_max?: number
          expected_wage_min?: number
          experience_years?: number | null
          government_id?: string | null
          id?: string
          location?: string
          name?: string
          phone?: string
          pincode?: string | null
          profile_image?: string | null
          skills?: string[]
          specialization?: string | null
          state?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      job_requirements: {
        Row: {
          created_at: string
          district: string
          end_date: string | null
          farmer_name: string
          farmer_phone: string
          id: string
          job_description: string
          job_location: string
          number_of_workers: number | null
          offered_wage: number
          required_skills: string[]
          start_date: string
          state: string
          status: string | null
          updated_at: string
          urgent: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          district: string
          end_date?: string | null
          farmer_name: string
          farmer_phone: string
          id?: string
          job_description: string
          job_location: string
          number_of_workers?: number | null
          offered_wage: number
          required_skills?: string[]
          start_date: string
          state: string
          status?: string | null
          updated_at?: string
          urgent?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          district?: string
          end_date?: string | null
          farmer_name?: string
          farmer_phone?: string
          id?: string
          job_description?: string
          job_location?: string
          number_of_workers?: number | null
          offered_wage?: number
          required_skills?: string[]
          start_date?: string
          state?: string
          status?: string | null
          updated_at?: string
          urgent?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      labor_bookings: {
        Row: {
          commission_amount: number | null
          commission_percentage: number | null
          created_at: string
          district: string
          end_date: string
          end_time: string | null
          farmer_id: string | null
          farmer_notes: string | null
          final_amount: number | null
          id: string
          labor_id: string | null
          labor_notes: string | null
          location: string
          number_of_workers: number | null
          offered_wage: number
          payment_status: string | null
          required_skills: Database["public"]["Enums"]["skill_type"][]
          start_date: string
          start_time: string | null
          state: string
          status: Database["public"]["Enums"]["booking_status"] | null
          task_description: string
          total_amount: number | null
          updated_at: string
          work_completed_at: string | null
          work_location_lat: number | null
          work_location_lng: number | null
          work_started_at: string | null
        }
        Insert: {
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string
          district: string
          end_date: string
          end_time?: string | null
          farmer_id?: string | null
          farmer_notes?: string | null
          final_amount?: number | null
          id?: string
          labor_id?: string | null
          labor_notes?: string | null
          location: string
          number_of_workers?: number | null
          offered_wage: number
          payment_status?: string | null
          required_skills?: Database["public"]["Enums"]["skill_type"][]
          start_date: string
          start_time?: string | null
          state: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          task_description: string
          total_amount?: number | null
          updated_at?: string
          work_completed_at?: string | null
          work_location_lat?: number | null
          work_location_lng?: number | null
          work_started_at?: string | null
        }
        Update: {
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string
          district?: string
          end_date?: string
          end_time?: string | null
          farmer_id?: string | null
          farmer_notes?: string | null
          final_amount?: number | null
          id?: string
          labor_id?: string | null
          labor_notes?: string | null
          location?: string
          number_of_workers?: number | null
          offered_wage?: number
          payment_status?: string | null
          required_skills?: Database["public"]["Enums"]["skill_type"][]
          start_date?: string
          start_time?: string | null
          state?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          task_description?: string
          total_amount?: number | null
          updated_at?: string
          work_completed_at?: string | null
          work_location_lat?: number | null
          work_location_lng?: number | null
          work_started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labor_bookings_labor_id_fkey"
            columns: ["labor_id"]
            isOneToOne: false
            referencedRelation: "labor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      labor_profiles: {
        Row: {
          availability:
            | Database["public"]["Enums"]["availability_status"]
            | null
          bank_account: string | null
          created_at: string
          daily_wage_max: number
          daily_wage_min: number
          description: string | null
          district: string
          experience_years: number | null
          government_id: string | null
          id: string
          location: string
          name: string
          phone: string
          pincode: string | null
          profile_image: string | null
          rating: number | null
          skills: Database["public"]["Enums"]["skill_type"][]
          state: string
          total_reviews: number | null
          updated_at: string
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          bank_account?: string | null
          created_at?: string
          daily_wage_max: number
          daily_wage_min: number
          description?: string | null
          district: string
          experience_years?: number | null
          government_id?: string | null
          id?: string
          location: string
          name: string
          phone: string
          pincode?: string | null
          profile_image?: string | null
          rating?: number | null
          skills?: Database["public"]["Enums"]["skill_type"][]
          state: string
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          bank_account?: string | null
          created_at?: string
          daily_wage_max?: number
          daily_wage_min?: number
          description?: string | null
          district?: string
          experience_years?: number | null
          government_id?: string | null
          id?: string
          location?: string
          name?: string
          phone?: string
          pincode?: string | null
          profile_image?: string | null
          rating?: number | null
          skills?: Database["public"]["Enums"]["skill_type"][]
          state?: string
          total_reviews?: number | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      machinery_bookings: {
        Row: {
          booking_type: string
          commission_amount: number | null
          commission_percentage: number | null
          created_at: string
          days: number | null
          district: string
          end_date: string
          end_time: string | null
          farmer_id: string | null
          farmer_notes: string | null
          final_amount: number | null
          fuel_cost: number | null
          hours: number | null
          id: string
          location: string
          machinery_id: string | null
          operator_cost: number | null
          operator_required: boolean | null
          owner_notes: string | null
          payment_status: string | null
          rate_per_unit: number
          start_date: string
          start_time: string | null
          state: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string
          work_completed_at: string | null
          work_location_lat: number | null
          work_location_lng: number | null
          work_started_at: string | null
        }
        Insert: {
          booking_type: string
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string
          days?: number | null
          district: string
          end_date: string
          end_time?: string | null
          farmer_id?: string | null
          farmer_notes?: string | null
          final_amount?: number | null
          fuel_cost?: number | null
          hours?: number | null
          id?: string
          location: string
          machinery_id?: string | null
          operator_cost?: number | null
          operator_required?: boolean | null
          owner_notes?: string | null
          payment_status?: string | null
          rate_per_unit: number
          start_date: string
          start_time?: string | null
          state: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string
          work_completed_at?: string | null
          work_location_lat?: number | null
          work_location_lng?: number | null
          work_started_at?: string | null
        }
        Update: {
          booking_type?: string
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string
          days?: number | null
          district?: string
          end_date?: string
          end_time?: string | null
          farmer_id?: string | null
          farmer_notes?: string | null
          final_amount?: number | null
          fuel_cost?: number | null
          hours?: number | null
          id?: string
          location?: string
          machinery_id?: string | null
          operator_cost?: number | null
          operator_required?: boolean | null
          owner_notes?: string | null
          payment_status?: string | null
          rate_per_unit?: number
          start_date?: string
          start_time?: string | null
          state?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string
          work_completed_at?: string | null
          work_location_lat?: number | null
          work_location_lng?: number | null
          work_started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "machinery_bookings_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "machinery_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      machinery_listings: {
        Row: {
          availability: boolean | null
          brand: string
          created_at: string
          daily_rate: number
          description: string | null
          district: string
          fuel_type: string | null
          horsepower: number | null
          hourly_rate: number
          id: string
          location: string
          machinery_images: string[] | null
          machinery_type: string
          model: string
          owner_name: string
          owner_phone: string
          pincode: string | null
          state: string
          updated_at: string
          user_id: string | null
          verified: boolean | null
          working_width: number | null
          year_of_purchase: number | null
        }
        Insert: {
          availability?: boolean | null
          brand: string
          created_at?: string
          daily_rate: number
          description?: string | null
          district: string
          fuel_type?: string | null
          horsepower?: number | null
          hourly_rate: number
          id?: string
          location: string
          machinery_images?: string[] | null
          machinery_type: string
          model: string
          owner_name: string
          owner_phone: string
          pincode?: string | null
          state: string
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
          working_width?: number | null
          year_of_purchase?: number | null
        }
        Update: {
          availability?: boolean | null
          brand?: string
          created_at?: string
          daily_rate?: number
          description?: string | null
          district?: string
          fuel_type?: string | null
          horsepower?: number | null
          hourly_rate?: number
          id?: string
          location?: string
          machinery_images?: string[] | null
          machinery_type?: string
          model?: string
          owner_name?: string
          owner_phone?: string
          pincode?: string | null
          state?: string
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
          working_width?: number | null
          year_of_purchase?: number | null
        }
        Relationships: []
      }
      machinery_profiles: {
        Row: {
          availability:
            | Database["public"]["Enums"]["availability_status"]
            | null
          brand: string
          created_at: string
          daily_rate: number
          description: string | null
          district: string
          fuel_type: string | null
          horsepower: number | null
          hourly_rate: number
          id: string
          location: string
          machinery_images: string[] | null
          machinery_type: Database["public"]["Enums"]["machinery_type"]
          model: string
          owner_id: string | null
          owner_name: string
          owner_phone: string
          pincode: string | null
          rating: number | null
          state: string
          total_reviews: number | null
          updated_at: string
          verified: boolean | null
          working_width: number | null
          year_of_purchase: number | null
        }
        Insert: {
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          brand: string
          created_at?: string
          daily_rate: number
          description?: string | null
          district: string
          fuel_type?: string | null
          horsepower?: number | null
          hourly_rate: number
          id?: string
          location: string
          machinery_images?: string[] | null
          machinery_type: Database["public"]["Enums"]["machinery_type"]
          model: string
          owner_id?: string | null
          owner_name: string
          owner_phone: string
          pincode?: string | null
          rating?: number | null
          state: string
          total_reviews?: number | null
          updated_at?: string
          verified?: boolean | null
          working_width?: number | null
          year_of_purchase?: number | null
        }
        Update: {
          availability?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          brand?: string
          created_at?: string
          daily_rate?: number
          description?: string | null
          district?: string
          fuel_type?: string | null
          horsepower?: number | null
          hourly_rate?: number
          id?: string
          location?: string
          machinery_images?: string[] | null
          machinery_type?: Database["public"]["Enums"]["machinery_type"]
          model?: string
          owner_id?: string | null
          owner_name?: string
          owner_phone?: string
          pincode?: string | null
          rating?: number | null
          state?: string
          total_reviews?: number | null
          updated_at?: string
          verified?: boolean | null
          working_width?: number | null
          year_of_purchase?: number | null
        }
        Relationships: []
      }
      machinery_requirements: {
        Row: {
          created_at: string
          district: string
          duration_days: number | null
          duration_hours: number | null
          farmer_name: string
          farmer_phone: string
          id: string
          location: string
          max_daily_rate: number | null
          max_hourly_rate: number | null
          preferred_brand: string | null
          required_date: string
          required_machinery_type: string
          specific_requirements: string | null
          state: string
          status: string | null
          updated_at: string
          urgent: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          district: string
          duration_days?: number | null
          duration_hours?: number | null
          farmer_name: string
          farmer_phone: string
          id?: string
          location: string
          max_daily_rate?: number | null
          max_hourly_rate?: number | null
          preferred_brand?: string | null
          required_date: string
          required_machinery_type: string
          specific_requirements?: string | null
          state: string
          status?: string | null
          updated_at?: string
          urgent?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          district?: string
          duration_days?: number | null
          duration_hours?: number | null
          farmer_name?: string
          farmer_phone?: string
          id?: string
          location?: string
          max_daily_rate?: number | null
          max_hourly_rate?: number | null
          preferred_brand?: string | null
          required_date?: string
          required_machinery_type?: string
          specific_requirements?: string | null
          state?: string
          status?: string | null
          updated_at?: string
          urgent?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          created_at: string
          crop_name: string
          district: string
          id: string
          location: string
          market_name: string
          price_date: string
          price_per_kg: number
          price_per_quintal: number
          quality_grade: string | null
          source: string | null
          state: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          crop_name: string
          district: string
          id?: string
          location: string
          market_name: string
          price_date?: string
          price_per_kg: number
          price_per_quintal: number
          quality_grade?: string | null
          source?: string | null
          state: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          crop_name?: string
          district?: string
          id?: string
          location?: string
          market_name?: string
          price_date?: string
          price_per_kg?: number
          price_per_quintal?: number
          quality_grade?: string | null
          source?: string | null
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          crops_grown: string[] | null
          district: string | null
          email: string | null
          farm_size: number | null
          farm_unit: string | null
          farming_type: string | null
          full_name: string
          gender: string | null
          id: string
          mobile_number: string | null
          notifications_enabled: boolean | null
          preferred_language: string | null
          profile_photo: string | null
          state: string | null
          total_crop_recommendations: number | null
          total_disease_checks: number | null
          total_learning_accessed: number | null
          total_machinery_booked: number | null
          total_schemes_viewed: number | null
          updated_at: string
          user_id: string
          village: string | null
          voice_assistant_enabled: boolean | null
        }
        Insert: {
          age?: number | null
          created_at?: string
          crops_grown?: string[] | null
          district?: string | null
          email?: string | null
          farm_size?: number | null
          farm_unit?: string | null
          farming_type?: string | null
          full_name: string
          gender?: string | null
          id?: string
          mobile_number?: string | null
          notifications_enabled?: boolean | null
          preferred_language?: string | null
          profile_photo?: string | null
          state?: string | null
          total_crop_recommendations?: number | null
          total_disease_checks?: number | null
          total_learning_accessed?: number | null
          total_machinery_booked?: number | null
          total_schemes_viewed?: number | null
          updated_at?: string
          user_id: string
          village?: string | null
          voice_assistant_enabled?: boolean | null
        }
        Update: {
          age?: number | null
          created_at?: string
          crops_grown?: string[] | null
          district?: string | null
          email?: string | null
          farm_size?: number | null
          farm_unit?: string | null
          farming_type?: string | null
          full_name?: string
          gender?: string | null
          id?: string
          mobile_number?: string | null
          notifications_enabled?: boolean | null
          preferred_language?: string | null
          profile_photo?: string | null
          state?: string | null
          total_crop_recommendations?: number | null
          total_disease_checks?: number | null
          total_learning_accessed?: number | null
          total_machinery_booked?: number | null
          total_schemes_viewed?: number | null
          updated_at?: string
          user_id?: string
          village?: string | null
          voice_assistant_enabled?: boolean | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string | null
          comment: string | null
          communication: number | null
          created_at: string
          id: string
          labor_id: string | null
          machinery_id: string | null
          punctuality: number | null
          rating: number
          reviewee_type: string
          reviewer_id: string | null
          work_quality: number | null
        }
        Insert: {
          booking_id?: string | null
          comment?: string | null
          communication?: number | null
          created_at?: string
          id?: string
          labor_id?: string | null
          machinery_id?: string | null
          punctuality?: number | null
          rating: number
          reviewee_type: string
          reviewer_id?: string | null
          work_quality?: number | null
        }
        Update: {
          booking_id?: string | null
          comment?: string | null
          communication?: number | null
          created_at?: string
          id?: string
          labor_id?: string | null
          machinery_id?: string | null
          punctuality?: number | null
          rating?: number
          reviewee_type?: string
          reviewer_id?: string | null
          work_quality?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_labor_id_fkey"
            columns: ["labor_id"]
            isOneToOne: false
            referencedRelation: "labor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_machinery_id_fkey"
            columns: ["machinery_id"]
            isOneToOne: false
            referencedRelation: "machinery_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string
          booking_type: string
          commission: number
          completed_at: string | null
          created_at: string
          id: string
          payer_id: string
          payment_method: string
          receiver_id: string
          status: string
          transaction_ref: string | null
        }
        Insert: {
          amount: number
          booking_id: string
          booking_type: string
          commission?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          payer_id: string
          payment_method: string
          receiver_id: string
          status?: string
          transaction_ref?: string | null
        }
        Update: {
          amount?: number
          booking_id?: string
          booking_type?: string
          commission?: number
          completed_at?: string | null
          created_at?: string
          id?: string
          payer_id?: string
          payment_method?: string
          receiver_id?: string
          status?: string
          transaction_ref?: string | null
        }
        Relationships: []
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          currency: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          currency?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      weather_alerts: {
        Row: {
          alert_type: string | null
          created_at: string
          district: string
          id: string
          location: string
          message: string | null
          severity: string | null
          state: string
          valid_until: string | null
          weather_data: Json
        }
        Insert: {
          alert_type?: string | null
          created_at?: string
          district: string
          id?: string
          location: string
          message?: string | null
          severity?: string | null
          state: string
          valid_until?: string | null
          weather_data: Json
        }
        Update: {
          alert_type?: string | null
          created_at?: string
          district?: string
          id?: string
          location?: string
          message?: string | null
          severity?: string | null
          state?: string
          valid_until?: string | null
          weather_data?: Json
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      list_job_profiles: {
        Args: { p_district?: string; p_state?: string }
        Returns: {
          availability: boolean
          created_at: string
          description: string
          district: string
          expected_wage_max: number
          expected_wage_min: number
          experience_years: number
          id: string
          location: string
          name: string
          phone: string
          pincode: string
          profile_image: string
          skills: string[]
          specialization: string
          state: string
          updated_at: string
          user_id: string
        }[]
      }
      list_labor_profiles: {
        Args: { p_district?: string; p_state?: string }
        Returns: {
          availability: Database["public"]["Enums"]["availability_status"]
          created_at: string
          daily_wage_max: number
          daily_wage_min: number
          description: string
          district: string
          experience_years: number
          id: string
          location: string
          name: string
          phone: string
          pincode: string
          profile_image: string
          rating: number
          skills: Database["public"]["Enums"]["skill_type"][]
          state: string
          total_reviews: number
          updated_at: string
          user_id: string
          verified: boolean
        }[]
      }
      update_wallet_balance: {
        Args: { p_amount: number; p_operation: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      availability_status: "available" | "busy" | "inactive"
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      machinery_type:
        | "tractor"
        | "harvester"
        | "tiller"
        | "irrigation_pump"
        | "sprayer"
        | "seed_drill"
        | "thresher"
        | "cultivator"
        | "plough"
        | "rotavator"
      skill_type:
        | "harvesting"
        | "sowing"
        | "irrigation"
        | "pest_control"
        | "fertilizer_application"
        | "land_preparation"
        | "weeding"
        | "transplanting"
        | "pruning"
        | "general_labor"
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
      availability_status: ["available", "busy", "inactive"],
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      machinery_type: [
        "tractor",
        "harvester",
        "tiller",
        "irrigation_pump",
        "sprayer",
        "seed_drill",
        "thresher",
        "cultivator",
        "plough",
        "rotavator",
      ],
      skill_type: [
        "harvesting",
        "sowing",
        "irrigation",
        "pest_control",
        "fertilizer_application",
        "land_preparation",
        "weeding",
        "transplanting",
        "pruning",
        "general_labor",
      ],
    },
  },
} as const
