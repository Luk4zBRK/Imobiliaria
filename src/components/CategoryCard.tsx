import { Link } from 'react-router-dom';
import { Home, Building2, Mountain, Store, Trees, Umbrella, LucideIcon, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { Category, useCategoryPropertyCount } from '@/hooks/useCategories';

interface CategoryCardProps {
  category: Category;
  index?: number;
}

const iconMap: Record<string, LucideIcon> = {
  Home,
  Building2,
  Mountain,
  Store,
  Trees,
  Umbrella,
  Layers,
};

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const Icon = iconMap[category.icon || 'Home'] || Home;
  const { data: propertiesCount = 0 } = useCategoryPropertyCount(category.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/imoveis?categoria=${category.slug}`} className="block">
        <div className="group relative bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Icon className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {category.nome}
              </h3>
              <p className="text-sm text-muted-foreground">
                {propertiesCount} {propertiesCount === 1 ? 'imóvel' : 'imóveis'}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
