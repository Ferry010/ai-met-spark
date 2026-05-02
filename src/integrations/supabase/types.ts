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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      certificates: {
        Row: {
          id: string
          issued_at: string
          pdf_url: string | null
          score: number | null
          user_id: string
        }
        Insert: {
          id?: string
          issued_at?: string
          pdf_url?: string | null
          score?: number | null
          user_id: string
        }
        Update: {
          id?: string
          issued_at?: string
          pdf_url?: string | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      class_codes: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          id: string
          school_id: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          school_id: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          school_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_codes_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      final_test_attempts: {
        Row: {
          attempted_at: string
          id: string
          passed: boolean
          score: number
          user_id: string
        }
        Insert: {
          attempted_at?: string
          id?: string
          passed: boolean
          score: number
          user_id: string
        }
        Update: {
          attempted_at?: string
          id?: string
          passed?: boolean
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      lesson_audio: {
        Row: {
          created_at: string
          lesson_id: string
          step: string
          storage_path: string
          text_hash: string
        }
        Insert: {
          created_at?: string
          lesson_id: string
          step: string
          storage_path: string
          text_hash: string
        }
        Update: {
          created_at?: string
          lesson_id?: string
          step?: string
          storage_path?: string
          text_hash?: string
        }
        Relationships: []
      }
      lesson_overrides: {
        Row: {
          emoji: string | null
          fact: string | null
          interactive: Json | null
          lesson_id: string
          quiz: Json | null
          reflection: string | null
          spark_intro: string | null
          spark_middle: string | null
          summary: string[] | null
          theory_deep: string | null
          theory_intro: string | null
          title: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          emoji?: string | null
          fact?: string | null
          interactive?: Json | null
          lesson_id: string
          quiz?: Json | null
          reflection?: string | null
          spark_intro?: string | null
          spark_middle?: string | null
          summary?: string[] | null
          theory_deep?: string | null
          theory_intro?: string | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          emoji?: string | null
          fact?: string | null
          interactive?: Json | null
          lesson_id?: string
          quiz?: Json | null
          reflection?: string | null
          spark_intro?: string | null
          spark_middle?: string | null
          summary?: string[] | null
          theory_deep?: string | null
          theory_intro?: string | null
          title?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string
          first_name: string
          id: string
          language: Database["public"]["Enums"]["app_language"]
          parent_email: string | null
          school_id: string | null
          updated_at: string
        }
        Insert: {
          age?: number | null
          created_at?: string
          first_name: string
          id: string
          language?: Database["public"]["Enums"]["app_language"]
          parent_email?: string | null
          school_id?: string | null
          updated_at?: string
        }
        Update: {
          age?: number | null
          created_at?: string
          first_name?: string
          id?: string
          language?: Database["public"]["Enums"]["app_language"]
          parent_email?: string | null
          school_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_fk"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      school_inquiries: {
        Row: {
          country: string
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          school: string
          seats: number
        }
        Insert: {
          country: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          school: string
          seats: number
        }
        Update: {
          country?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          school?: string
          seats?: number
        }
        Relationships: []
      }
      schools: {
        Row: {
          contact_email: string | null
          created_at: string
          id: string
          name: string
          seat_count: number
          teacher_id: string
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          id?: string
          name: string
          seat_count?: number
          teacher_id: string
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          id?: string
          name?: string
          seat_count?: number
          teacher_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string
          id: string
          lesson_id: string
          stars: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          lesson_id: string
          stars?: number
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          lesson_id?: string
          stars?: number
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      attach_certificate_pdf: {
        Args: { _path: string }
        Returns: {
          id: string
          issued_at: string
          pdf_url: string | null
          score: number | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "certificates"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_or_refresh_certificate: {
        Args: never
        Returns: {
          id: string
          issued_at: string
          pdf_url: string | null
          score: number | null
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "certificates"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_student_in_my_school: {
        Args: { _student_id: string }
        Returns: boolean
      }
      list_students_in_my_school: {
        Args: never
        Returns: {
          first_name: string
          id: string
          school_id: string
        }[]
      }
      validate_class_code: {
        Args: { _code: string }
        Returns: {
          school_id: string
          school_name: string
          valid: boolean
        }[]
      }
      validate_school_inquiry: {
        Args: {
          _country: string
          _email: string
          _message: string
          _name: string
          _school: string
          _seats: number
        }
        Returns: boolean
      }
    }
    Enums: {
      app_language: "en" | "nl" | "es"
      app_role: "student" | "teacher" | "admin"
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
      app_language: ["en", "nl", "es"],
      app_role: ["student", "teacher", "admin"],
    },
  },
} as const
