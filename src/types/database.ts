export type ItemFrequency = "daily" | "weekly" | "custom";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          timezone: string;
          onboarding_completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          timezone?: string;
          onboarding_completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      categories: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          slug: string;
          icon: string | null;
          is_default: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          slug: string;
          icon?: string | null;
          is_default?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          name?: string;
          slug?: string;
          icon?: string | null;
          is_default?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      care_items: {
        Row: {
          id: string;
          user_id: string | null;
          category_id: string;
          name: string;
          description: string | null;
          icon: string | null;
          frequency: ItemFrequency;
          frequency_days: number[] | null;
          start_date: string;
          is_default: boolean;
          archived_at: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          category_id: string;
          name: string;
          description?: string | null;
          icon?: string | null;
          frequency?: ItemFrequency;
          frequency_days?: number[] | null;
          start_date?: string;
          is_default?: boolean;
          archived_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          category_id?: string;
          name?: string;
          description?: string | null;
          icon?: string | null;
          frequency?: ItemFrequency;
          frequency_days?: number[] | null;
          start_date?: string;
          is_default?: boolean;
          archived_at?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      user_hidden_items: {
        Row: {
          user_id: string;
          item_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          item_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          item_id?: string;
          created_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      user_item_flags: {
        Row: {
          user_id: string;
          item_id: string;
          wants_improvement: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          item_id: string;
          wants_improvement?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          item_id?: string;
          wants_improvement?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: GenericRelationship[];
      };
      care_logs: {
        Row: {
          id: string;
          item_id: string;
          user_id: string;
          log_date: string;
          completed: boolean;
          intensity: number;
          remark: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          item_id: string;
          user_id?: string;
          log_date: string;
          completed?: boolean;
          intensity?: number;
          remark?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          item_id?: string;
          user_id?: string;
          log_date?: string;
          completed?: boolean;
          intensity?: number;
          remark?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: GenericRelationship[];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      toggle_care_completion: {
        Args: { p_item_id: string; p_date?: string };
        Returns: boolean;
      };
      set_care_intensity: {
        Args: { p_item_id: string; p_intensity: number; p_date?: string };
        Returns: number;
      };
      upsert_care_remark: {
        Args: { p_item_id: string; p_date: string; p_remark: string | null };
        Returns: undefined;
      };
      get_care_metrics: {
        Args: {
          p_user_id?: string;
          p_start_date?: string;
          p_end_date?: string;
        };
        Returns: {
          completion_rate: number;
          current_streak: number;
          growth_trend: number;
          steps_forward: number;
          longest_streak: number;
          physical_rate: number;
          social_rate: number;
          emotional_rate: number;
          spiritual_rate: number;
          professional_rate: number;
          strongest_category_id: string | null;
          strongest_category_name: string | null;
          needs_attention_category_id: string | null;
          needs_attention_category_name: string | null;
        }[];
      };
      get_care_score_trend: {
        Args: { p_user_id?: string; p_days?: number };
        Returns: {
          score_date: string;
          completion_rate: number;
          current_streak: number;
          physical_rate: number;
          social_rate: number;
          emotional_rate: number;
          spiritual_rate: number;
          professional_rate: number;
          growth_trend: number;
        }[];
      };
      get_category_analytics: {
        Args: {
          p_category_id: string;
          p_start_date?: string;
          p_end_date?: string;
        };
        Returns: {
          category_id: string;
          category_name: string;
          item_count: number;
          scheduled_days: number;
          completed_days: number;
          completion_rate: number;
        }[];
      };
      get_care_calendar: {
        Args: {
          p_year: number;
          p_month: number;
          p_user_id?: string;
        };
        Returns: {
          calendar_date: string;
          scheduled_count: number;
          completed_count: number;
          completion_rate: number;
        }[];
      };
      get_latest_item_intensities: {
        Args: { p_as_of?: string | null };
        Returns: { item_id: string; intensity: number; log_date: string }[];
      };
      set_wants_improvement: {
        Args: { p_item_id: string; p_wants_improvement: boolean };
        Returns: undefined;
      };
    };
    Enums: {
      item_frequency: ItemFrequency;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type CareItem = Database["public"]["Tables"]["care_items"]["Row"];
export type CareLog = Database["public"]["Tables"]["care_logs"]["Row"];
export type CareItemInsert = Database["public"]["Tables"]["care_items"]["Insert"];
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
export type UserItemFlag = Database["public"]["Tables"]["user_item_flags"]["Row"];
