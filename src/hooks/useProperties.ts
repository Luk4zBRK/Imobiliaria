import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PropertyImage {
  id: string;
  url: string;
  ordem: number;
  is_cover: boolean;
}

export interface Property {
  id: string;
  titulo: string;
  slug: string;
  descricao: string | null;
  finalidade: string;
  tipo: string;
  status: string;
  categoria_id: string | null;
  cidade: string;
  bairro: string;
  endereco: string | null;
  preco: number;
  preco_locacao: number | null;
  condominio: number | null;
  iptu: number | null;
  area_total: number;
  area_construida: number | null;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  mobiliado: boolean;
  aceita_permuta: boolean;
  destaque: boolean;
  codigo_interno: string;
  codigo_externo: string | null;
  codigo_crm: string | null;
  codigo_portal: string | null;
  latitude: number | null;
  longitude: number | null;
  contato_whatsapp: string | null;
  contato_telefone: string | null;
  contato_email: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
  images: PropertyImage[];
  category?: {
    id: string;
    nome: string;
    slug: string;
    icon: string | null;
  } | null;
}

export function useProperties() {
  return useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          *,
          category:categories(id, nome, slug, icon)
        `)
        .eq('status', 'publicado')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch images for all properties
      const propertyIds = properties?.map(p => p.id) || [];
      
      const { data: images, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .in('property_id', propertyIds)
        .order('ordem', { ascending: true });

      if (imagesError) throw imagesError;

      // Map images to properties
      const propertiesWithImages = properties?.map(property => ({
        ...property,
        images: images?.filter(img => img.property_id === property.id) || []
      })) || [];

      return propertiesWithImages as Property[];
    }
  });
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: async () => {
      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          *,
          category:categories(id, nome, slug, icon)
        `)
        .eq('status', 'publicado')
        .eq('destaque', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) throw error;

      // Fetch images for featured properties
      const propertyIds = properties?.map(p => p.id) || [];
      
      const { data: images, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .in('property_id', propertyIds)
        .order('ordem', { ascending: true });

      if (imagesError) throw imagesError;

      // Map images to properties
      const propertiesWithImages = properties?.map(property => ({
        ...property,
        images: images?.filter(img => img.property_id === property.id) || []
      })) || [];

      return propertiesWithImages as Property[];
    }
  });
}

export function usePropertyBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['property', slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data: property, error } = await supabase
        .from('properties')
        .select(`
          *,
          category:categories(id, nome, slug, icon)
        `)
        .eq('slug', slug)
        .single();

      if (error) throw error;

      // Fetch images for this property
      const { data: images, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .eq('property_id', property.id)
        .order('ordem', { ascending: true });

      if (imagesError) throw imagesError;

      return {
        ...property,
        images: images || []
      } as Property;
    },
    enabled: !!slug
  });
}

export function useRelatedProperties(categoryId: string | null | undefined, currentPropertyId: string | undefined) {
  return useQuery({
    queryKey: ['properties', 'related', categoryId, currentPropertyId],
    queryFn: async () => {
      if (!categoryId) return [];

      const { data: properties, error } = await supabase
        .from('properties')
        .select(`
          *,
          category:categories(id, nome, slug, icon)
        `)
        .eq('status', 'publicado')
        .eq('categoria_id', categoryId)
        .neq('id', currentPropertyId || '')
        .limit(3);

      if (error) throw error;

      // Fetch images
      const propertyIds = properties?.map(p => p.id) || [];
      
      const { data: images, error: imagesError } = await supabase
        .from('property_images')
        .select('*')
        .in('property_id', propertyIds)
        .order('ordem', { ascending: true });

      if (imagesError) throw imagesError;

      const propertiesWithImages = properties?.map(property => ({
        ...property,
        images: images?.filter(img => img.property_id === property.id) || []
      })) || [];

      return propertiesWithImages as Property[];
    },
    enabled: !!categoryId
  });
}

// Utility functions
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatArea(area: number): string {
  if (area >= 10000) {
    return `${(area / 10000).toFixed(1).replace('.', ',')} ha`;
  }
  return `${area.toLocaleString('pt-BR')} m²`;
}
