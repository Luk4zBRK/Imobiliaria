import { Link } from 'react-router-dom';
import { ArrowRight, Building2, MapPin, Shield, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { SearchForm } from '@/components/SearchForm';
import { PropertyCard } from '@/components/PropertyCard';
import { CategoryCard } from '@/components/CategoryCard';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { useCategories } from '@/hooks/useCategories';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { Skeleton } from '@/components/ui/skeleton';
import heroImage from '@/assets/hero-socorro.jpg';

export default function HomePage() {
  const { data: featuredProperties, isLoading: loadingProperties } = useFeaturedProperties();
  const { data: categories, isLoading: loadingCategories } = useCategories();
  const { getSetting, loading: loadingSettings } = useSiteSettings();

  const heroTitulo = getSetting('hero_titulo', 'Realize o sonho do seu imóvel ideal');
  const heroSubtitulo = getSetting('hero_subtitulo', 'Encontre casas, apartamentos, terrenos e imóveis comerciais com atendimento personalizado e exclusivo.');
  const heroImagem = getSetting('hero_imagem', '');
  const contatoWhatsapp = getSetting('contato_whatsapp', '5511999999999');
  const seoTitulo = getSetting('seo_titulo', 'EA Corretor de Imóveis');
  const seoDescricao = getSetting('seo_descricao', 'Encontre casas, apartamentos, terrenos e imóveis comerciais de alto padrão.');

  const stats = [
    { icon: Building2, value: '500+', label: 'Imóveis Disponíveis' },
    { icon: MapPin, value: '50+', label: 'Cidades Atendidas' },
    { icon: Award, value: '15+', label: 'Anos de Experiência' },
    { icon: TrendingUp, value: 'R$ 2B+', label: 'Em Negócios Fechados' },
  ];

  return (
    <>
      <SEO
        title="Início"
        description={seoDescricao}
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroImagem || heroImage}
            alt="Imóvel de luxo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
        </div>

        {/* Content */}
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-3xl">
            <motion.span
              className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="h-4 w-4" />
              Corretor de Imóveis
            </motion.span>

            <motion.h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {heroTitulo.includes('imóvel ideal') ? (
                <>
                  Realize o sonho do seu{' '}
                  <span className="text-primary">imóvel ideal</span>
                </>
              ) : (
                heroTitulo
              )}
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {heroSubtitulo}
            </motion.p>
          </div>

          {/* Search Form */}
          <SearchForm className="max-w-5xl" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <motion.h2
                className="section-title mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Imóveis em Destaque
              </motion.h2>
              <motion.p
                className="section-subtitle"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Seleção exclusiva dos melhores imóveis disponíveis
              </motion.p>
            </div>
            <Link to="/imoveis">
              <Button variant="outline" className="gap-2">
                Ver Todos os Imóveis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {loadingProperties ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-96 rounded-xl" />
              ))}
            </div>
          ) : featuredProperties && featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum imóvel em destaque no momento.
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.h2
              className="section-title mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Explore por Categoria
            </motion.h2>
            <motion.p
              className="section-subtitle mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Encontre o tipo de imóvel perfeito para você
            </motion.p>
          </div>

          {loadingCategories ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories?.map((category, index) => (
                <CategoryCard key={category.id} category={category} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-navy">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Quer anunciar seu imóvel?
            </motion.h2>
            <motion.p
              className="text-lg text-primary-foreground/80 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Conte com nossa experiência para vender ou alugar seu imóvel com rapidez e segurança.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/anuncie">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 py-6">
                  Anunciar meu Imóvel
                </Button>
              </Link>
              <a
                href="https://api.whatsapp.com/send/?phone=5519992372866&text=Ol%C3%A1+Erik+vim+do+site+e+gostaria+de+maiores+informa%C3%A7%C3%B5es"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="text-base px-8 py-6 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Falar pelo WhatsApp
                </Button>
              </a>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
