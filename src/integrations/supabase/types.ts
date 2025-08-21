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
      forum_posts: {
        Row: {
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
      labor_bookings: {
        Row: {
          created_at: string
          district: string
          end_date: string
          end_time: string | null
          farmer_id: string | null
          farmer_notes: string | null
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
        }
        Insert: {
          created_at?: string
          district: string
          end_date: string
          end_time?: string | null
          farmer_id?: string | null
          farmer_notes?: string | null
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
        }
        Update: {
          created_at?: string
          district?: string
          end_date?: string
          end_time?: string | null
          farmer_id?: string | null
          farmer_notes?: string | null
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
          created_at: string
          days: number | null
          district: string
          end_date: string
          end_time: string | null
          farmer_id: string | null
          farmer_notes: string | null
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
        }
        Insert: {
          booking_type: string
          created_at?: string
          days?: number | null
          district: string
          end_date: string
          end_time?: string | null
          farmer_id?: string | null
          farmer_notes?: string | null
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
        }
        Update: {
          booking_type?: string
          created_at?: string
          days?: number | null
          district?: string
          end_date?: string
          end_time?: string | null
          farmer_id?: string | null
          farmer_notes?: string | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
