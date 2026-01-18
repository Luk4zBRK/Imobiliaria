import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bed,
  Bath,
  Car,
  Maximize,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Armchair,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { SEO } from '@/components/SEO';
import { PropertyCard } from '@/components/PropertyCard';
import { usePropertyBySlug, useRelatedProperties, formatPrice, formatArea } from '@/hooks/useProperties';
import { toast } from 'sonner';

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const { data: property, isLoading, error } = usePropertyBySlug(slug);
  const { data: relatedProperties = [] } = useRelatedProperties(property?.categoria_id, property?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <section className="bg-background border-b border-border py-4">
          <div className="container-custom">
            <Skeleton className="h-6 w-24" />
          </div>
        </section>
        <section className="bg-background">
          <div className="container-custom py-6">
            <Skeleton className="aspect-[16/9] md:aspect-[21/9] rounded-xl" />
          </div>
        </section>
        <section className="py-8">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-48" />
              </div>
              <Skeleton className="h-96" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Imóvel não encontrado</h1>
          <Link to="/imoveis">
            <Button>Ver todos os imóveis</Button>
          </Link>
        </div>
      </div>
    );
  }

  const finalidadeLabel: Record<string, string> = {
    venda: 'Venda',
    aluguel: 'Aluguel',
    temporada: 'Temporada',
  };

  const statusLabel: Record<string, string> = {
    publicado: 'Disponível',
    rascunho: 'Rascunho',
    inativo: 'Inativo',
    vendido: 'Vendido',
    alugado: 'Alugado',
  };

  const price =
    property.finalidade === 'aluguel' || property.finalidade === 'temporada'
      ? property.preco_locacao || property.preco
      : property.preco;

  const priceLabel =
    property.finalidade === 'aluguel'
      ? '/mês'
      : property.finalidade === 'temporada'
      ? '/dia'
      : '';

  const whatsappMessage = encodeURIComponent(
    'Olá Erik vim do site e gostaria de maiores informações'
  );
  const whatsappLink = `https://api.whatsapp.com/send/?phone=5519992372866&text=${whatsappMessage}`;

  const copyCode = () => {
    navigator.clipboard.writeText(property.codigo_interno);
    setCopied(true);
    toast.success('Código copiado!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareProperty = async () => {
    if (navigator.share) {
      await navigator.share({
        title: property.titulo,
        text: `Confira este imóvel: ${property.titulo}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado!');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === (property.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? (property.images?.length || 1) - 1 : prev - 1
    );
  };

  const features = [
    { icon: Bed, label: 'Quartos', value: property.quartos },
    { icon: Bath, label: 'Banheiros', value: property.banheiros },
    { icon: Car, label: 'Vagas', value: property.vagas },
    { icon: Maximize, label: 'Área Total', value: formatArea(property.area_total) },
    {
      icon: Ruler,
      label: 'Área Construída',
      value: property.area_construida ? formatArea(property.area_construida) : null,
    },
    { icon: Armchair, label: 'Mobiliado', value: property.mobiliado ? 'Sim' : 'Não' },
  ].filter((f) => f.value);

  const details = [
    { label: 'Tipo', value: property.tipo },
    { label: 'Categoria', value: property.category?.nome },
    { label: 'Cidade', value: property.cidade },
    { label: 'Bairro', value: property.bairro },
    { label: 'Suítes', value: property.suites },
    {
      label: 'Condomínio',
      value: property.condominio ? formatPrice(property.condominio) : null,
    },
    { label: 'IPTU', value: property.iptu ? formatPrice(property.iptu) : null },
    { label: 'Aceita Permuta', value: property.aceita_permuta ? 'Sim' : 'Não' },
  ].filter((d) => d.value);

  return (
    <>
      <SEO
        title={property.titulo}
        description={property.descricao?.substring(0, 160) || ''}
        image={property.images?.[0]?.url}
        type="product"
      />

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <section className="bg-background border-b border-border py-4">
          <div className="container-custom">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
          </div>
        </section>

        {/* Gallery */}
        <section className="bg-background">
          <div className="container-custom py-6">
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden bg-muted">
              {property.images && property.images.length > 0 ? (
                <>
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentImageIndex}
                      src={property.images[currentImageIndex]?.url}
                      alt={property.titulo}
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </AnimatePresence>

                  {property.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {property.images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentImageIndex
                                ? 'bg-primary'
                                : 'bg-background/60'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <MapPin className="h-16 w-16" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container-custom">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Title & Badges */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge
                      variant={property.finalidade === 'venda' ? 'default' : 'secondary'}
                      className={
                        property.finalidade === 'venda'
                          ? 'bg-primary text-primary-foreground'
                          : ''
                      }
                    >
                      {finalidadeLabel[property.finalidade] || property.finalidade}
                    </Badge>
                    <Badge variant="outline">{property.category?.nome || 'Imóvel'}</Badge>
                    <Badge variant="outline">{statusLabel[property.status] || property.status}</Badge>
                  </div>

                  <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {property.titulo}
                  </h1>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>
                      {property.endereco ? `${property.endereco}, ` : ''}{property.bairro} - {property.cidade}
                    </span>
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {features.map((feature) => (
                    <div
                      key={feature.label}
                      className="flex items-center gap-3 p-4 bg-card rounded-lg border border-border"
                    >
                      <feature.icon className="h-6 w-6 text-primary shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">{feature.label}</p>
                        <p className="font-semibold">{feature.value}</p>
                      </div>
                    </div>
                  ))}
                </motion.div>

                {/* Description */}
                {property.descricao && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="font-display text-xl font-semibold mb-4">
                      Sobre o Imóvel
                    </h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {property.descricao}
                    </p>
                  </motion.div>
                )}

                {/* Details Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="font-display text-xl font-semibold mb-4">
                    Características
                  </h2>
                  <div className="bg-card rounded-lg border border-border overflow-hidden">
                    {details.map((detail, index) => (
                      <div
                        key={detail.label}
                        className={`flex justify-between items-center px-4 py-3 ${
                          index !== details.length - 1 ? 'border-b border-border' : ''
                        }`}
                      >
                        <span className="text-muted-foreground">{detail.label}</span>
                        <span className="font-medium">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Price Card */}
                <motion.div
                  className="bg-card rounded-xl p-6 border border-border sticky top-24"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Valor</p>
                    <p className="font-display text-3xl font-bold text-primary">
                      {formatPrice(price)}
                      <span className="text-lg font-normal text-muted-foreground">
                        {priceLabel}
                      </span>
                    </p>
                    {property.condominio && (
                      <p className="text-sm text-muted-foreground mt-1">
                        + {formatPrice(property.condominio)} de condomínio
                      </p>
                    )}
                  </div>

                  {/* Code */}
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-6">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Código:</span>
                      <span className="font-mono font-semibold">
                        {property.codigo_interno}
                      </span>
                    </div>
                    <button
                      onClick={copyCode}
                      className="p-1.5 hover:bg-background rounded transition-colors"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-success" />
                      ) : (
                        <Copy className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <Separator className="my-6" />

                  {/* Contact Buttons */}
                  <div className="space-y-3">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full gap-2 bg-success hover:bg-success/90 text-primary-foreground">
                        <MessageCircle className="h-5 w-5" />
                        Chamar no WhatsApp
                      </Button>
                    </a>

                    <a href={whatsappLink} className="block" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full gap-2">
                        <Phone className="h-5 w-5" />
                        Ligar Agora
                      </Button>
                    </a>

                    <Button
                      variant="ghost"
                      className="w-full gap-2"
                      onClick={shareProperty}
                    >
                      <Share2 className="h-5 w-5" />
                      Compartilhar
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Properties */}
        {relatedProperties.length > 0 && (
          <section className="py-16 bg-background">
            <div className="container-custom">
              <h2 className="section-title mb-8">Imóveis Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedProperties.map((prop, index) => (
                  <PropertyCard key={prop.id} property={prop} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  );
}
