import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  nome: string;
  slug: string;
  icon: string | null;
  ordem: number;
  created_at: string;
  updated_at: string;
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('ordem', { ascending: true });

      if (error) throw error;
      return data as Category[];
    }
  });
}

export function useCategoryBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data as Category;
    },
    enabled: !!slug
  });
}

export function useCategoryPropertyCount(categoryId: string) {
  return useQuery({
    queryKey: ['properties', 'count', categoryId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('categoria_id', categoryId)
        .eq('status', 'publicado');

      if (error) throw error;
      return count || 0;
    }
  });
}
