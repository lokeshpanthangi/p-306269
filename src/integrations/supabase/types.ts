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
      blocks: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          page_id: string
          parent_block_id: string | null
          position: number
          properties: Json | null
          type: Database["public"]["Enums"]["block_type"]
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          page_id: string
          parent_block_id?: string | null
          position?: number
          properties?: Json | null
          type: Database["public"]["Enums"]["block_type"]
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          page_id?: string
          parent_block_id?: string | null
          position?: number
          properties?: Json | null
          type?: Database["public"]["Enums"]["block_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blocks_parent_block_id_fkey"
            columns: ["parent_block_id"]
            isOneToOne: false
            referencedRelation: "blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          author_id: string
          block_id: string | null
          content: string
          created_at: string | null
          id: string
          page_id: string
          parent_comment_id: string | null
          resolved: boolean | null
          updated_at: string | null
        }
        Insert: {
          author_id: string
          block_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          page_id: string
          parent_comment_id?: string | null
          resolved?: boolean | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          block_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          page_id?: string
          parent_comment_id?: string | null
          resolved?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
        ]
      }
      database_properties: {
        Row: {
          created_at: string | null
          database_id: string
          id: string
          name: string
          options: Json | null
          position: number
          type: Database["public"]["Enums"]["property_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          database_id: string
          id?: string
          name: string
          options?: Json | null
          position?: number
          type: Database["public"]["Enums"]["property_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          database_id?: string
          id?: string
          name?: string
          options?: Json | null
          position?: number
          type?: Database["public"]["Enums"]["property_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "database_properties_database_id_fkey"
            columns: ["database_id"]
            isOneToOne: false
            referencedRelation: "databases"
            referencedColumns: ["id"]
          },
        ]
      }
      database_rows: {
        Row: {
          created_at: string | null
          database_id: string
          id: string
          position: number
          properties: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          database_id: string
          id?: string
          position?: number
          properties?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          database_id?: string
          id?: string
          position?: number
          properties?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "database_rows_database_id_fkey"
            columns: ["database_id"]
            isOneToOne: false
            referencedRelation: "databases"
            referencedColumns: ["id"]
          },
        ]
      }
      database_views: {
        Row: {
          created_at: string | null
          database_id: string
          filters: Json | null
          group_by: string | null
          id: string
          is_default: boolean | null
          name: string
          properties_order: Json | null
          sorts: Json | null
          type: Database["public"]["Enums"]["database_view_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          database_id: string
          filters?: Json | null
          group_by?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          properties_order?: Json | null
          sorts?: Json | null
          type?: Database["public"]["Enums"]["database_view_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          database_id?: string
          filters?: Json | null
          group_by?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          properties_order?: Json | null
          sorts?: Json | null
          type?: Database["public"]["Enums"]["database_view_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "database_views_database_id_fkey"
            columns: ["database_id"]
            isOneToOne: false
            referencedRelation: "databases"
            referencedColumns: ["id"]
          },
        ]
      }
      databases: {
        Row: {
          cover_image: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          page_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          page_id: string
          title?: string
          updated_at?: string | null
        }
        Update: {
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          page_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "databases_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      page_shares: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          is_public: boolean | null
          page_id: string
          permission: Database["public"]["Enums"]["permission_level"]
          public_token: string | null
          shared_with: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          is_public?: boolean | null
          page_id: string
          permission?: Database["public"]["Enums"]["permission_level"]
          public_token?: string | null
          shared_with?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          is_public?: boolean | null
          page_id?: string
          permission?: Database["public"]["Enums"]["permission_level"]
          public_token?: string | null
          shared_with?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_shares_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_shares_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_shares_shared_with_fkey"
            columns: ["shared_with"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: Json | null
          cover_image: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_template: boolean | null
          owner_id: string
          parent_id: string | null
          template_category: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          cover_image?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_template?: boolean | null
          owner_id: string
          parent_id?: string | null
          template_category?: string | null
          title?: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          cover_image?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_template?: boolean | null
          owner_id?: string
          parent_id?: string | null
          template_category?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      recent_pages: {
        Row: {
          id: string
          page_id: string
          user_id: string
          visited_at: string | null
        }
        Insert: {
          id?: string
          page_id: string
          user_id: string
          visited_at?: string | null
        }
        Update: {
          id?: string
          page_id?: string
          user_id?: string
          visited_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recent_pages_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recent_pages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_recent_page: {
        Args: { page_uuid: string }
        Returns: undefined
      }
    }
    Enums: {
      block_type:
        | "paragraph"
        | "heading-1"
        | "heading-2"
        | "heading-3"
        | "bulleted-list"
        | "numbered-list"
        | "quote"
        | "callout"
        | "image"
        | "video"
        | "file"
        | "checkbox"
        | "code"
        | "math"
        | "columns"
        | "divider"
        | "toggle"
        | "database"
      database_view_type: "table" | "board" | "calendar" | "list"
      permission_level: "view" | "comment" | "edit" | "full_access"
      property_type:
        | "title"
        | "text"
        | "number"
        | "select"
        | "multi-select"
        | "date"
        | "checkbox"
        | "url"
        | "email"
        | "relation"
        | "formula"
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
      block_type: [
        "paragraph",
        "heading-1",
        "heading-2",
        "heading-3",
        "bulleted-list",
        "numbered-list",
        "quote",
        "callout",
        "image",
        "video",
        "file",
        "checkbox",
        "code",
        "math",
        "columns",
        "divider",
        "toggle",
        "database",
      ],
      database_view_type: ["table", "board", "calendar", "list"],
      permission_level: ["view", "comment", "edit", "full_access"],
      property_type: [
        "title",
        "text",
        "number",
        "select",
        "multi-select",
        "date",
        "checkbox",
        "url",
        "email",
        "relation",
        "formula",
      ],
    },
  },
} as const
