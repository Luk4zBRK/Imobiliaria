import { Link } from 'react-router-dom';
import { Bed, Bath, Car, Maximize, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Property, formatPrice, formatArea } from '@/hooks/useProperties';

interface PropertyCardProps {
  property: Property;
  index?: number;
}

export function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const coverImage = property.images?.find(img => img.is_cover) || property.images?.[0];

  const finalidadeLabel: Record<string, string> = {
    venda: 'Venda',
    aluguel: 'Aluguel',
    temporada: 'Temporada',
  };

  const price = property.finalidade === 'aluguel' || property.finalidade === 'temporada'
    ? property.preco_locacao || property.preco
    : property.preco;

  const priceLabel = property.finalidade === 'aluguel'
    ? '/mês'
    : property.finalidade === 'temporada'
    ? '/dia'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/imovel/${property.slug}`} className="block">
        <article className="card-property group">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {coverImage ? (
              <img
                src={coverImage.url}
                alt={property.titulo}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <MapPin className="h-12 w-12" />
              </div>
            )}
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className={`chip ${property.finalidade === 'venda' ? 'chip-sale' : property.finalidade === 'aluguel' ? 'chip-rent' : 'chip-highlight'}`}>
                {finalidadeLabel[property.finalidade] || property.finalidade}
              </span>
              {property.destaque && (
                <span className="chip chip-highlight">Destaque</span>
              )}
            </div>
            {/* Code */}
            <div className="absolute bottom-3 right-3">
              <span className="bg-foreground/80 text-primary-foreground text-xs px-2 py-1 rounded">
                {property.codigo_interno}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            {/* Category & Type */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{property.category?.nome || 'Imóvel'}</span>
              <span>•</span>
              <span>{property.tipo}</span>
            </div>

            {/* Title */}
            <h3 className="font-display text-lg font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {property.titulo}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{property.bairro}, {property.cidade}</span>
            </div>

            {/* Features */}
            {(property.quartos > 0 || property.area_total > 0) && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                {property.quartos > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Bed className="h-4 w-4" />
                    <span>{property.quartos}</span>
                  </div>
                )}
                {property.banheiros > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4" />
                    <span>{property.banheiros}</span>
                  </div>
                )}
                {property.vagas > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Car className="h-4 w-4" />
                    <span>{property.vagas}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Maximize className="h-4 w-4" />
                  <span>{formatArea(property.area_total)}</span>
                </div>
              </div>
            )}

            {/* Price */}
            <div className="pt-3 border-t border-border">
              <p className="font-display text-xl font-bold text-primary">
                {formatPrice(price)}
                <span className="text-sm font-normal text-muted-foreground">{priceLabel}</span>
              </p>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
