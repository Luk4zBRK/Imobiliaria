import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { PropertyCard } from '@/components/PropertyCard';
import { useProperties } from '@/hooks/useProperties';
import { useCategories } from '@/hooks/useCategories';

type SortOption = 'recent' | 'price-asc' | 'price-desc' | 'area-desc';

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: allProperties = [], isLoading: loadingProperties } = useProperties();
  const { data: categories = [], isLoading: loadingCategories } = useCategories();

  // Filters from URL
  const searchQuery = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('categoria') || '';
  const finalidadeFilter = searchParams.get('finalidade') || '';
  const cityFilter = searchParams.get('cidade') || '';
  const sortBy = (searchParams.get('ordem') || 'recent') as SortOption;

  // Local filter state
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [localCategory, setLocalCategory] = useState(categoryFilter);
  const [localFinalidade, setLocalFinalidade] = useState(finalidadeFilter);
  const [localCity, setLocalCity] = useState(cityFilter);

  // Get unique cities
  const cities = useMemo(() => {
    const citySet = new Set(allProperties.map(p => p.cidade));
    return Array.from(citySet).sort();
  }, [allProperties]);

  // Find category by slug
  const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    let result = [...allProperties];

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p =>
          p.titulo.toLowerCase().includes(query) ||
          p.cidade.toLowerCase().includes(query) ||
          p.bairro.toLowerCase().includes(query) ||
          p.codigo_interno.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter) {
      const category = getCategoryBySlug(categoryFilter);
      if (category) {
        result = result.filter(p => p.categoria_id === category.id);
      }
    }

    // Finalidade filter
    if (finalidadeFilter) {
      result = result.filter(p => p.finalidade === finalidadeFilter);
    }

    // City filter
    if (cityFilter) {
      result = result.filter(p => p.cidade === cityFilter);
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.preco - b.preco);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.preco - a.preco);
        break;
      case 'area-desc':
        result = [...result].sort((a, b) => b.area_total - a.area_total);
        break;
      case 'recent':
      default:
        result = [...result].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return result;
  }, [allProperties, categories, searchQuery, categoryFilter, finalidadeFilter, cityFilter, sortBy]);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (localSearch) params.set('q', localSearch);
    if (localCategory && localCategory !== 'all') params.set('categoria', localCategory);
    if (localFinalidade && localFinalidade !== 'all') params.set('finalidade', localFinalidade);
    if (localCity && localCity !== 'all') params.set('cidade', localCity);
    if (sortBy !== 'recent') params.set('ordem', sortBy);
    setSearchParams(params);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setLocalCategory('');
    setLocalFinalidade('');
    setLocalCity('');
    setSearchParams({});
  };

  const hasActiveFilters = searchQuery || categoryFilter || finalidadeFilter || cityFilter;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Buscar
        </label>
        <Input
          type="text"
          placeholder="Cidade, bairro ou código..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Categoria
        </label>
        <Select value={localCategory} onValueChange={setLocalCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Finalidade */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Finalidade
        </label>
        <Select value={localFinalidade} onValueChange={setLocalFinalidade}>
          <SelectTrigger>
            <SelectValue placeholder="Todas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="venda">Venda</SelectItem>
            <SelectItem value="aluguel">Aluguel</SelectItem>
            <SelectItem value="temporada">Temporada</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Cidade
        </label>
        <Select value={localCity} onValueChange={setLocalCity}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as cidades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as cidades</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={clearFilters} className="flex-1">
          Limpar
        </Button>
        <Button onClick={applyFilters} className="flex-1 btn-gold">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <SEO
        title="Imóveis"
        description="Explore nossa seleção de casas, apartamentos, terrenos e imóveis comerciais disponíveis para venda e locação."
      />

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <section className="bg-background border-b border-border py-8">
          <div className="container-custom">
            <motion.h1
              className="section-title mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Imóveis Disponíveis
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {filteredProperties.length} {filteredProperties.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
            </motion.p>
          </div>
        </section>

        {/* Toolbar */}
        <section className="bg-background border-b border-border sticky top-20 z-40">
          <div className="container-custom py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Mobile Filter Button */}
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                    {hasActiveFilters && (
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filtrar Imóveis</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="hidden lg:flex items-center gap-2 flex-1">
                  {searchQuery && (
                    <span className="chip bg-secondary text-secondary-foreground">
                      Busca: {searchQuery}
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(searchParams);
                          params.delete('q');
                          setSearchParams(params);
                        }}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {categoryFilter && (
                    <span className="chip bg-secondary text-secondary-foreground">
                      {getCategoryBySlug(categoryFilter)?.nome}
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(searchParams);
                          params.delete('categoria');
                          setSearchParams(params);
                        }}
                        className="ml-2"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Limpar filtros
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4 ml-auto">
                {/* Sort */}
                <Select
                  value={sortBy}
                  onValueChange={(value: SortOption) => {
                    const params = new URLSearchParams(searchParams);
                    params.set('ordem', value);
                    setSearchParams(params);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Mais Recentes</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="area-desc">Maior Área</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="hidden md:flex border border-border rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-muted' : ''}`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-muted' : ''}`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="container-custom">
            <div className="flex gap-8">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-72 shrink-0">
                <div className="bg-card rounded-xl p-6 border border-border sticky top-36">
                  <h3 className="font-display text-lg font-semibold mb-6">
                    Filtrar Resultados
                  </h3>
                  <FilterContent />
                </div>
              </aside>

              {/* Properties Grid */}
              <div className="flex-1">
                {loadingProperties ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Skeleton key={i} className="h-96 rounded-xl" />
                    ))}
                  </div>
                ) : filteredProperties.length > 0 ? (
                  <div
                    className={`grid gap-6 ${
                      viewMode === 'grid'
                        ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
                        : 'grid-cols-1'
                    }`}
                  >
                    {filteredProperties.map((property, index) => (
                      <PropertyCard key={property.id} property={property} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <p className="text-lg text-muted-foreground mb-4">
                      Nenhum imóvel encontrado com os filtros selecionados.
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
