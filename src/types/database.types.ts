export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      units: {
        Row: {
          id: string
          title: string
          grade: number
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          grade: number
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          grade?: number
          order_index?: number
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          unit_id: string | null
          title: string
          slug: string | null
          content: string | null
          custom_css: string | null
          quiz_data: Json | null
          type: 'theory' | 'practice'
          order_index: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          unit_id?: string | null
          title: string
          slug?: string | null
          content?: string | null
          custom_css?: string | null
          type?: 'theory' | 'practice'
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          unit_id?: string | null
          title?: string
          slug?: string | null
          content?: string | null
          custom_css?: string | null
          type?: 'theory' | 'practice'
          order_index?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      math_concepts: {
        Row: {
          id: string
          grade: number
          name: string
          definition: string | null
          vol: number | null
          chapter: number | null
          page_start: number | null
          tags: string[] | null
          created_at: string | null
        }
        Insert: {
          id: string
          grade: number
          name: string
          definition?: string | null
          vol?: number | null
          chapter?: number | null
          page_start?: number | null
          tags?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          grade?: number
          name?: string
          definition?: string | null
          vol?: number | null
          chapter?: number | null
          page_start?: number | null
          tags?: string[] | null
          created_at?: string | null
        }
      }
      concept_relationships: {
        Row: {
          id: number
          source_id: string | null
          target_id: string | null
          relationship_type: 'requires' | 'related_to' | 'part_of' | null
          description: string | null
        }
        Insert: {
          id?: number
          source_id?: string | null
          target_id?: string | null
          relationship_type?: 'requires' | 'related_to' | 'part_of' | null
          description?: string | null
        }
        Update: {
          id?: number
          source_id?: string | null
          target_id?: string | null
          relationship_type?: 'requires' | 'related_to' | 'part_of' | null
          description?: string | null
        }
      }
    }
  }
}
