export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clothes: {
        Row: {
          category: Database["public"]["Enums"]["clothingCategoryEnum"]
          cloth_id: number
          created_at: string
          image_url: string
          name: string
          profile_id: string | null
          shopping_url: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["clothingCategoryEnum"]
          cloth_id?: never
          created_at?: string
          image_url: string
          name: string
          profile_id?: string | null
          shopping_url: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["clothingCategoryEnum"]
          cloth_id?: never
          created_at?: string
          image_url?: string
          name?: string
          profile_id?: string | null
          shopping_url?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clothes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      models: {
        Row: {
          age_range: Database["public"]["Enums"]["age_range"]
          body_type: Database["public"]["Enums"]["body_type"]
          created_at: string
          description: string | null
          gender: Database["public"]["Enums"]["gender"]
          image_url: string
          is_public: boolean
          model_id: number
          name: string
          profile_id: string | null
          prompt: string | null
          race: Database["public"]["Enums"]["race"]
          reference_model_id: number | null
          style: Database["public"]["Enums"]["style"]
          updated_at: string
        }
        Insert: {
          age_range?: Database["public"]["Enums"]["age_range"]
          body_type?: Database["public"]["Enums"]["body_type"]
          created_at?: string
          description?: string | null
          gender?: Database["public"]["Enums"]["gender"]
          image_url: string
          is_public?: boolean
          model_id?: never
          name: string
          profile_id?: string | null
          prompt?: string | null
          race?: Database["public"]["Enums"]["race"]
          reference_model_id?: number | null
          style?: Database["public"]["Enums"]["style"]
          updated_at?: string
        }
        Update: {
          age_range?: Database["public"]["Enums"]["age_range"]
          body_type?: Database["public"]["Enums"]["body_type"]
          created_at?: string
          description?: string | null
          gender?: Database["public"]["Enums"]["gender"]
          image_url?: string
          is_public?: boolean
          model_id?: never
          name?: string
          profile_id?: string | null
          prompt?: string | null
          race?: Database["public"]["Enums"]["race"]
          reference_model_id?: number | null
          style?: Database["public"]["Enums"]["style"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "models_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "models_reference_model_id_models_model_id_fk"
            columns: ["reference_model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["model_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles_clothes_rel: {
        Row: {
          cloth_id: number | null
          created_at: string
          id: number
          image_url: string
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          cloth_id?: number | null
          created_at?: string
          id?: never
          image_url: string
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          cloth_id?: number | null
          created_at?: string
          id?: never
          image_url?: string
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_clothes_rel_cloth_id_clothes_cloth_id_fk"
            columns: ["cloth_id"]
            isOneToOne: false
            referencedRelation: "clothes"
            referencedColumns: ["cloth_id"]
          },
          {
            foreignKeyName: "profiles_clothes_rel_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
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
      age_range:
        | "1-5"
        | "6-10"
        | "11-15"
        | "16-20"
        | "21-25"
        | "26-30"
        | "31-35"
        | "36-40"
        | "41-45"
        | "46-50"
        | "51-55"
        | "56-60"
        | "61-"
      body_type:
        | "slim"
        | "average"
        | "athletic"
        | "curvy"
        | "plus"
        | "muscular"
        | "petite"
        | "tall"
      clothingCategoryEnum:
        | "top"
        | "bottom"
        | "one-piece"
        | "outer"
        | "shoes"
        | "accessory"
      gender: "male" | "female" | "other"
      race:
        | "asian"
        | "black"
        | "white"
        | "latino"
        | "middle-eastern"
        | "indian"
        | "other"
      style:
        | "cute"
        | "sexy"
        | "casual"
        | "formal"
        | "street"
        | "sporty"
        | "elegant"
        | "vintage"
        | "punk"
        | "minimal"
        | "modern"
        | "goth"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      age_range: [
        "1-5",
        "6-10",
        "11-15",
        "16-20",
        "21-25",
        "26-30",
        "31-35",
        "36-40",
        "41-45",
        "46-50",
        "51-55",
        "56-60",
        "61-",
      ],
      body_type: [
        "slim",
        "average",
        "athletic",
        "curvy",
        "plus",
        "muscular",
        "petite",
        "tall",
      ],
      clothingCategoryEnum: [
        "top",
        "bottom",
        "one-piece",
        "outer",
        "shoes",
        "accessory",
      ],
      gender: ["male", "female", "other"],
      race: [
        "asian",
        "black",
        "white",
        "latino",
        "middle-eastern",
        "indian",
        "other",
      ],
      style: [
        "cute",
        "sexy",
        "casual",
        "formal",
        "street",
        "sporty",
        "elegant",
        "vintage",
        "punk",
        "minimal",
        "modern",
        "goth",
      ],
    },
  },
} as const
