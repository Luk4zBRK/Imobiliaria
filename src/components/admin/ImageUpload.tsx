import { useState, useCallback } from 'react';
import { Upload, X, Star, Loader2, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface PropertyImage {
  id?: string;
  url: string;
  is_cover: boolean;
  ordem: number;
  file?: File;
  isNew?: boolean;
  isLoading?: boolean;
}

interface ImageUploadProps {
  propertyId?: string;
  images: PropertyImage[];
  onChange: (images: PropertyImage[]) => void;
  disabled?: boolean;
}

export function ImageUpload({ propertyId, images, onChange, disabled }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const maxOrdem = images.length > 0 ? Math.max(...images.map(img => img.ordem)) : -1;
    const newImages: PropertyImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} não é uma imagem válida`);
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} excede o limite de 5MB`);
        continue;
      }

      // Create preview URL immediately
      const previewUrl = URL.createObjectURL(file);
      newImages.push({
        url: previewUrl,
        is_cover: images.length === 0 && i === 0,
        ordem: maxOrdem + 1 + i,
        file,
        isNew: true,
        isLoading: true,
      });
    }

    // Add images with loading state
    const updatedImages = [...images, ...newImages];
    onChange(updatedImages);

    // Simulate brief loading to show preview effect
    setTimeout(() => {
      const finalImages = updatedImages.map(img => ({
        ...img,
        isLoading: false,
      }));
      onChange(finalImages);
    }, 500);
  }, [images, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = (index: number) => {
    const imageToRemove = images[index];
    // Revoke object URL to free memory
    if (imageToRemove.isNew && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    const newImages = images.filter((_, i) => i !== index);
    // If removed image was cover, set first image as cover
    if (imageToRemove.is_cover && newImages.length > 0) {
      newImages[0].is_cover = true;
    }
    onChange(newImages);
  };

  const handleSetCover = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      is_cover: i === index,
    }));
    onChange(newImages);
  };

  const uploadImages = async (propertyId: string): Promise<boolean> => {
    setUploading(true);
    try {
      // First, delete old images from property_images that are no longer in the list
      const existingIds = images.filter(img => img.id).map(img => img.id);
      
      if (existingIds.length > 0) {
        // Keep only the ones still in the list
        const { error: deleteError } = await supabase
          .from('property_images')
          .delete()
          .eq('property_id', propertyId)
          .not('id', 'in', `(${existingIds.join(',')})`);
        
        if (deleteError) console.error('Error deleting old images:', deleteError);
      } else {
        // Delete all existing images for this property
        await supabase
          .from('property_images')
          .delete()
          .eq('property_id', propertyId);
      }

      // Upload new images
      for (const image of images) {
        if (image.isNew && image.file) {
          const fileExt = image.file.name.split('.').pop();
          const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, image.file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            toast.error(`Erro ao fazer upload: ${image.file.name}`);
            continue;
          }

          const { data: publicUrl } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          // Save to property_images table
          const { error: insertError } = await supabase
            .from('property_images')
            .insert({
              property_id: propertyId,
              url: publicUrl.publicUrl,
              is_cover: image.is_cover,
              ordem: image.ordem,
            });

          if (insertError) {
            console.error('Insert error:', insertError);
          }
        } else if (image.id) {
          // Update existing image
          await supabase
            .from('property_images')
            .update({
              is_cover: image.is_cover,
              ordem: image.ordem,
            })
            .eq('id', image.id);
        }
      }

      return true;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Erro ao salvar imagens');
      return false;
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200',
          dragOver ? 'border-primary bg-primary/10 scale-[1.02]' : 'border-border hover:border-primary/50',
          disabled && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="image-upload"
          disabled={disabled}
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <div className={cn(
            'p-3 rounded-full transition-colors',
            dragOver ? 'bg-primary/20' : 'bg-muted'
          )}>
            <Upload className={cn(
              'h-6 w-6 transition-colors',
              dragOver ? 'text-primary' : 'text-muted-foreground'
            )} />
          </div>
          <p className="text-sm text-muted-foreground">
            Arraste imagens aqui ou{' '}
            <span className="text-primary font-medium">clique para selecionar</span>
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP ou GIF (máx. 5MB cada)
          </p>
        </label>
      </div>

      {/* Image grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id || `${image.url}-${index}`}
              className={cn(
                'relative group aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300',
                image.is_cover ? 'border-gold ring-2 ring-gold/30' : 'border-transparent',
                image.isLoading && 'animate-pulse'
              )}
            >
              {/* Image with loading state */}
              <div className="relative w-full h-full">
                <img
                  src={image.url}
                  alt={`Imagem ${index + 1}`}
                  className={cn(
                    'w-full h-full object-cover transition-opacity duration-300',
                    image.isLoading ? 'opacity-50' : 'opacity-100'
                  )}
                />
                
                {/* Loading overlay */}
                {image.isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="text-xs font-medium text-foreground">Carregando...</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Hover overlay */}
              {!image.isLoading && (
                <div className="absolute inset-0 bg-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => handleSetCover(index)}
                    title="Definir como capa"
                    className="h-8 w-8 shadow-lg"
                  >
                    <Star className={cn('h-4 w-4', image.is_cover && 'fill-gold text-gold')} />
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemove(index)}
                    title="Remover"
                    className="h-8 w-8 shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Cover badge */}
              {image.is_cover && !image.isLoading && (
                <div className="absolute top-2 left-2 bg-gold text-navy text-xs font-medium px-2 py-1 rounded shadow-md">
                  Capa
                </div>
              )}

              {/* New badge */}
              {image.isNew && !image.isLoading && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded shadow-md animate-in fade-in duration-300">
                  Nova
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload count indicator */}
      {images.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>{images.length} {images.length === 1 ? 'imagem' : 'imagens'}</span>
          </div>
          {images.some(img => img.isNew) && (
            <span className="text-primary">
              {images.filter(img => img.isNew).length} nova(s) para enviar
            </span>
          )}
        </div>
      )}

      {uploading && (
        <div className="flex items-center justify-center gap-2 text-muted-foreground py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Enviando imagens...</span>
        </div>
      )}
    </div>
  );
}

export type { PropertyImage };
