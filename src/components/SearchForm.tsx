import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Home, DollarSign, Bed, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories } from '@/data/mockData';
import { motion } from 'framer-motion';

interface SearchFormProps {
  variant?: 'hero' | 'compact';
  className?: string;
}

export function SearchForm({ variant = 'hero', className = '' }: SearchFormProps) {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [finalidade, setFinalidade] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('q', location);
    if (category) params.set('categoria', category);
    if (finalidade) params.set('finalidade', finalidade);
    if (priceRange) params.set('preco', priceRange);
    if (bedrooms) params.set('quartos', bedrooms);
    navigate(`/imoveis?${params.toString()}`);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por cidade, bairro ou código..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit" className="btn-gold">
          Buscar
        </Button>
      </form>
    );
  }

  return (
    <motion.form
      onSubmit={handleSearch}
      className={`bg-card rounded-2xl shadow-xl p-6 md:p-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Location */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Localização
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cidade ou bairro"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-11 h-12"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Tipo de Imóvel
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-12">
              <Home className="h-5 w-5 text-muted-foreground mr-2" />
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
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
          <Select value={finalidade} onValueChange={setFinalidade}>
            <SelectTrigger className="h-12">
              <SlidersHorizontal className="h-5 w-5 text-muted-foreground mr-2" />
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

        {/* Search Button */}
        <div className="flex items-end">
          <Button type="submit" className="btn-gold w-full h-12 text-base gap-2">
            <Search className="h-5 w-5" />
            Buscar Imóvel
          </Button>
        </div>
      </div>

      {/* Advanced Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Faixa de Preço
          </label>
          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="h-11">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Qualquer valor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer valor</SelectItem>
              <SelectItem value="0-500000">Até R$ 500 mil</SelectItem>
              <SelectItem value="500000-1000000">R$ 500 mil - R$ 1 milhão</SelectItem>
              <SelectItem value="1000000-2000000">R$ 1 - 2 milhões</SelectItem>
              <SelectItem value="2000000-5000000">R$ 2 - 5 milhões</SelectItem>
              <SelectItem value="5000000+">Acima de R$ 5 milhões</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Quartos
          </label>
          <Select value={bedrooms} onValueChange={setBedrooms}>
            <SelectTrigger className="h-11">
              <Bed className="h-4 w-4 text-muted-foreground mr-2" />
              <SelectValue placeholder="Qualquer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Qualquer</SelectItem>
              <SelectItem value="1">1+ quarto</SelectItem>
              <SelectItem value="2">2+ quartos</SelectItem>
              <SelectItem value="3">3+ quartos</SelectItem>
              <SelectItem value="4">4+ quartos</SelectItem>
              <SelectItem value="5">5+ quartos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Code Search */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Código do Imóvel
          </label>
          <Input
            type="text"
            placeholder="Ex: EA-1001"
            className="h-11"
          />
        </div>
      </div>
    </motion.form>
  );
}
