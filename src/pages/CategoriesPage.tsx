import { SEO } from '@/components/SEO';
import { CategoryCard } from '@/components/CategoryCard';
import { useCategories } from '@/hooks/useCategories';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();

  return (
    <>
      <SEO
        title="Categorias"
        description="Explore imóveis por categoria: casas, apartamentos, terrenos, comercial, rural e temporada."
      />

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <section className="bg-background border-b border-border py-16">
          <div className="container-custom text-center">
            <motion.h1
              className="section-title mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Categorias de Imóveis
            </motion.h1>
            <motion.p
              className="section-subtitle mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Encontre o tipo de imóvel ideal para sua necessidade
            </motion.p>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16">
          <div className="container-custom">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-24 rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories?.map((category, index) => (
                  <CategoryCard key={category.id} category={category} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
