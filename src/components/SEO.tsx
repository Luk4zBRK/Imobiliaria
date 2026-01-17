import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
}

export function SEO({
  title,
  description = 'Encontre o imóvel dos seus sonhos com EA Corretor de Imóveis. Casas, apartamentos, terrenos e imóveis comerciais em São Paulo e região.',
  keywords = 'imóveis, casas, apartamentos, terrenos, corretor de imóveis, São Paulo, comprar imóvel, alugar imóvel',
  image,
  url,
  type = 'website',
  noIndex = false,
}: SEOProps) {
  const siteName = 'EA Corretor de Imóveis';
  const fullTitle = title === 'Início' ? siteName : `${title} | ${siteName}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      
      {/* Canonical */}
      {url && <link rel="canonical" href={url} />}
    </Helmet>
  );
}
