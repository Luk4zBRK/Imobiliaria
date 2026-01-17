import apartamento1 from '@/assets/properties/apartamento-1.jpg';
import casa1 from '@/assets/properties/casa-1.jpg';
import cobertura1 from '@/assets/properties/cobertura-1.jpg';
import comercial1 from '@/assets/properties/comercial-1.jpg';
import rural1 from '@/assets/properties/rural-1.jpg';
import terreno1 from '@/assets/properties/terreno-1.jpg';
import temporada1 from '@/assets/properties/temporada-1.jpg';

export interface Category {
  id: string;
  nome: string;
  slug: string;
  ordem: number;
  icon: string;
}

export interface PropertyImage {
  id: string;
  url: string;
  ordem: number;
  isCover: boolean;
}

export interface Property {
  id: string;
  titulo: string;
  slug: string;
  descricao: string;
  finalidade: 'venda' | 'aluguel' | 'temporada';
  status: 'publicado' | 'rascunho' | 'inativo' | 'vendido' | 'alugado';
  destaque: boolean;
  tipo: string;
  categoriaId: string;
  cidade: string;
  bairro: string;
  endereco: string;
  latitude?: number;
  longitude?: number;
  preco: number;
  precoLocacao?: number;
  condominio?: number;
  iptu?: number;
  areaTotal: number;
  areaConstruida?: number;
  quartos: number;
  suites: number;
  banheiros: number;
  vagas: number;
  mobiliado: boolean;
  aceitaPermuta: boolean;
  codigoInterno: string;
  codigoPortal?: string;
  codigoCrm?: string;
  codigoExterno?: string;
  seoTitle?: string;
  seoDescription?: string;
  contatoWhatsapp: string;
  contatoTelefone?: string;
  contatoEmail?: string;
  images: PropertyImage[];
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  origem: 'contato' | 'anuncie' | 'imovel';
  propertyId?: string;
  status: 'novo' | 'em_contato' | 'fechado';
  createdAt: string;
}

export interface User {
  id: string;
  nome: string;
  email: string;
  role: 'admin' | 'editor';
  createdAt: string;
}

export const categories: Category[] = [
  { id: '1', nome: 'Casa', slug: 'casa', ordem: 1, icon: 'Home' },
  { id: '2', nome: 'Apartamento', slug: 'apartamento', ordem: 2, icon: 'Building2' },
  { id: '3', nome: 'Terreno', slug: 'terreno', ordem: 3, icon: 'Mountain' },
  { id: '4', nome: 'Comercial', slug: 'comercial', ordem: 4, icon: 'Store' },
  { id: '5', nome: 'Rural', slug: 'rural', ordem: 5, icon: 'Trees' },
  { id: '6', nome: 'Temporada', slug: 'temporada', ordem: 6, icon: 'Umbrella' },
];

export const properties: Property[] = [
  {
    id: '1',
    titulo: 'Apartamento Luxuoso com Vista Panorâmica',
    slug: 'apartamento-luxuoso-vista-panoramica',
    descricao: 'Apartamento de alto padrão com acabamento premium, varanda gourmet e vista deslumbrante da cidade. Localizado em condomínio fechado com infraestrutura completa incluindo piscina, academia, salão de festas e segurança 24h.',
    finalidade: 'venda',
    status: 'publicado',
    destaque: true,
    tipo: 'Apartamento',
    categoriaId: '2',
    cidade: 'São Paulo',
    bairro: 'Jardins',
    endereco: 'Rua Oscar Freire, 1500',
    latitude: -23.5629,
    longitude: -46.6688,
    preco: 2850000,
    condominio: 1800,
    iptu: 450,
    areaTotal: 180,
    areaConstruida: 165,
    quartos: 4,
    suites: 2,
    banheiros: 3,
    vagas: 3,
    mobiliado: false,
    aceitaPermuta: true,
    codigoInterno: 'EA-1001',
    codigoPortal: 'ZAP-45678',
    contatoWhatsapp: '5511999999999',
    contatoTelefone: '1132345678',
    contatoEmail: 'contato@eacorretor.com.br',
    images: [
      { id: '1', url: apartamento1, ordem: 1, isCover: true },
      { id: '2', url: cobertura1, ordem: 2, isCover: false },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    titulo: 'Casa Moderna com Piscina e Jardim Tropical',
    slug: 'casa-moderna-piscina-jardim-tropical',
    descricao: 'Espetacular casa contemporânea em condomínio de alto padrão. Arquitetura assinada, amplos ambientes integrados, piscina com deck de madeira e jardim tropical exuberante. Perfeita para quem busca qualidade de vida.',
    finalidade: 'venda',
    status: 'publicado',
    destaque: true,
    tipo: 'Casa em Condomínio',
    categoriaId: '1',
    cidade: 'Campinas',
    bairro: 'Alphaville',
    endereco: 'Alameda das Palmeiras, 250',
    latitude: -22.9064,
    longitude: -47.0616,
    preco: 4500000,
    condominio: 2500,
    iptu: 800,
    areaTotal: 600,
    areaConstruida: 450,
    quartos: 5,
    suites: 4,
    banheiros: 6,
    vagas: 4,
    mobiliado: true,
    aceitaPermuta: false,
    codigoInterno: 'EA-1002',
    codigoPortal: 'VIVA-12345',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '3', url: casa1, ordem: 1, isCover: true },
    ],
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
  },
  {
    id: '3',
    titulo: 'Cobertura Duplex com Terraço Panorâmico',
    slug: 'cobertura-duplex-terraco-panoramico',
    descricao: 'Cobertura duplex espetacular com piscina privativa e vista 360° da cidade. Acabamento de altíssimo padrão, home office, espaço gourmet completo e terraço com paisagismo. O ápice do luxo e sofisticação.',
    finalidade: 'venda',
    status: 'publicado',
    destaque: true,
    tipo: 'Cobertura',
    categoriaId: '2',
    cidade: 'Rio de Janeiro',
    bairro: 'Leblon',
    endereco: 'Av. Delfim Moreira, 800',
    latitude: -22.9878,
    longitude: -43.2249,
    preco: 12000000,
    condominio: 4500,
    iptu: 1200,
    areaTotal: 400,
    areaConstruida: 350,
    quartos: 4,
    suites: 4,
    banheiros: 5,
    vagas: 4,
    mobiliado: true,
    aceitaPermuta: true,
    codigoInterno: 'EA-1003',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '4', url: cobertura1, ordem: 1, isCover: true },
    ],
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-08T10:00:00Z',
  },
  {
    id: '4',
    titulo: 'Sala Comercial em Edifício Triple A',
    slug: 'sala-comercial-edificio-triple-a',
    descricao: 'Excelente sala comercial em edifício corporativo de alto padrão. Ar-condicionado central, piso elevado, infraestrutura para TI, banheiros privativos e vagas de garagem. Ideal para escritórios e consultórios.',
    finalidade: 'aluguel',
    status: 'publicado',
    destaque: false,
    tipo: 'Sala Comercial',
    categoriaId: '4',
    cidade: 'São Paulo',
    bairro: 'Itaim Bibi',
    endereco: 'Av. Brigadeiro Faria Lima, 3000',
    preco: 450000,
    precoLocacao: 18000,
    condominio: 3500,
    areaTotal: 150,
    areaConstruida: 150,
    quartos: 0,
    suites: 0,
    banheiros: 2,
    vagas: 4,
    mobiliado: false,
    aceitaPermuta: false,
    codigoInterno: 'EA-1004',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '5', url: comercial1, ordem: 1, isCover: true },
    ],
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-05T10:00:00Z',
  },
  {
    id: '5',
    titulo: 'Fazenda Produtiva com Sede de Luxo',
    slug: 'fazenda-produtiva-sede-luxo',
    descricao: 'Magnífica fazenda com sede completamente equipada, piscina, curral, pastagens formadas e nascentes. Ideal para pecuária ou agricultura. Acesso asfaltado e a apenas 2h de São Paulo.',
    finalidade: 'venda',
    status: 'publicado',
    destaque: true,
    tipo: 'Fazenda',
    categoriaId: '5',
    cidade: 'Bragança Paulista',
    bairro: 'Zona Rural',
    endereco: 'Estrada Municipal, km 15',
    preco: 8500000,
    areaTotal: 500000,
    areaConstruida: 800,
    quartos: 6,
    suites: 4,
    banheiros: 7,
    vagas: 10,
    mobiliado: true,
    aceitaPermuta: true,
    codigoInterno: 'EA-1005',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '6', url: rural1, ordem: 1, isCover: true },
    ],
    createdAt: '2024-01-03T10:00:00Z',
    updatedAt: '2024-01-03T10:00:00Z',
  },
  {
    id: '6',
    titulo: 'Terreno em Condomínio Fechado',
    slug: 'terreno-condominio-fechado',
    descricao: 'Excelente terreno em condomínio de alto padrão com infraestrutura completa. Topografia plana, pronto para construir. Condomínio com segurança 24h, área de lazer e clube.',
    finalidade: 'venda',
    status: 'publicado',
    destaque: false,
    tipo: 'Terreno',
    categoriaId: '3',
    cidade: 'Sorocaba',
    bairro: 'Jardim Europa',
    endereco: 'Rua das Acácias, Lote 45',
    preco: 680000,
    areaTotal: 450,
    quartos: 0,
    suites: 0,
    banheiros: 0,
    vagas: 0,
    mobiliado: false,
    aceitaPermuta: true,
    codigoInterno: 'EA-1006',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '7', url: terreno1, ordem: 1, isCover: true },
    ],
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
  },
  {
    id: '7',
    titulo: 'Casa de Praia Pé na Areia',
    slug: 'casa-praia-pe-areia',
    descricao: 'Deslumbrante casa à beira-mar com acesso direto à praia. Arquitetura praiana sofisticada, amplo deck com vista para o oceano, piscina e jardim tropical. Perfeita para temporada ou moradia.',
    finalidade: 'temporada',
    status: 'publicado',
    destaque: true,
    tipo: 'Casa de Praia',
    categoriaId: '6',
    cidade: 'Ubatuba',
    bairro: 'Praia do Lázaro',
    endereco: 'Av. Beira Mar, 100',
    preco: 5200000,
    precoLocacao: 3500,
    areaTotal: 800,
    areaConstruida: 350,
    quartos: 5,
    suites: 5,
    banheiros: 6,
    vagas: 4,
    mobiliado: true,
    aceitaPermuta: false,
    codigoInterno: 'EA-1007',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '8', url: temporada1, ordem: 1, isCover: true },
    ],
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '8',
    titulo: 'Apartamento Garden com Área Externa',
    slug: 'apartamento-garden-area-externa',
    descricao: 'Lindo apartamento garden com ampla área externa privativa. Ideal para quem busca espaço e comodidade. Condomínio com piscina, playground e quadra poliesportiva.',
    finalidade: 'venda',
    status: 'publicado',
    destaque: false,
    tipo: 'Apartamento Garden',
    categoriaId: '2',
    cidade: 'São Paulo',
    bairro: 'Vila Madalena',
    endereco: 'Rua Harmonia, 350',
    preco: 1250000,
    condominio: 980,
    iptu: 280,
    areaTotal: 120,
    areaConstruida: 85,
    quartos: 3,
    suites: 1,
    banheiros: 2,
    vagas: 2,
    mobiliado: false,
    aceitaPermuta: true,
    codigoInterno: 'EA-1008',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '9', url: apartamento1, ordem: 1, isCover: true },
    ],
    createdAt: '2023-12-28T10:00:00Z',
    updatedAt: '2023-12-28T10:00:00Z',
  },
  {
    id: '9',
    titulo: 'Casa Térrea em Bairro Nobre',
    slug: 'casa-terrea-bairro-nobre',
    descricao: 'Elegante casa térrea em rua tranquila de bairro nobre. Ambientes amplos, jardim frontal, quintal com churrasqueira e edícula. Excelente para família.',
    finalidade: 'venda',
    status: 'publicado',
    destaque: false,
    tipo: 'Casa Térrea',
    categoriaId: '1',
    cidade: 'Ribeirão Preto',
    bairro: 'Alto da Boa Vista',
    endereco: 'Rua dos Ipês, 180',
    preco: 1800000,
    iptu: 350,
    areaTotal: 400,
    areaConstruida: 220,
    quartos: 4,
    suites: 2,
    banheiros: 3,
    vagas: 3,
    mobiliado: false,
    aceitaPermuta: true,
    codigoInterno: 'EA-1009',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '10', url: casa1, ordem: 1, isCover: true },
    ],
    createdAt: '2023-12-25T10:00:00Z',
    updatedAt: '2023-12-25T10:00:00Z',
  },
  {
    id: '10',
    titulo: 'Loja de Rua em Ponto Comercial',
    slug: 'loja-rua-ponto-comercial',
    descricao: 'Excelente loja de rua em ponto comercial consolidado. Alto fluxo de pedestres, vitrine ampla e estacionamento rotativo na rua. Ideal para varejo.',
    finalidade: 'aluguel',
    status: 'publicado',
    destaque: false,
    tipo: 'Loja',
    categoriaId: '4',
    cidade: 'São Paulo',
    bairro: 'Pinheiros',
    endereco: 'Rua Teodoro Sampaio, 1200',
    preco: 850000,
    precoLocacao: 12000,
    areaTotal: 80,
    areaConstruida: 80,
    quartos: 0,
    suites: 0,
    banheiros: 1,
    vagas: 0,
    mobiliado: false,
    aceitaPermuta: false,
    codigoInterno: 'EA-1010',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '11', url: comercial1, ordem: 1, isCover: true },
    ],
    createdAt: '2023-12-20T10:00:00Z',
    updatedAt: '2023-12-20T10:00:00Z',
  },
  {
    id: '11',
    titulo: 'Sítio com Lago e Área de Lazer',
    slug: 'sitio-lago-area-lazer',
    descricao: 'Encantador sítio com lago para pesca, pomar, horta e completa área de lazer. Casa sede com 3 quartos, churrasqueira coberta e deck. Refúgio perfeito para fins de semana.',
    finalidade: 'venda',
    status: 'publicado',
    destaque: false,
    tipo: 'Sítio',
    categoriaId: '5',
    cidade: 'Atibaia',
    bairro: 'Zona Rural',
    endereco: 'Estrada do Rosário, km 8',
    preco: 1200000,
    areaTotal: 48000,
    areaConstruida: 180,
    quartos: 3,
    suites: 1,
    banheiros: 2,
    vagas: 6,
    mobiliado: true,
    aceitaPermuta: true,
    codigoInterno: 'EA-1011',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '12', url: rural1, ordem: 1, isCover: true },
    ],
    createdAt: '2023-12-18T10:00:00Z',
    updatedAt: '2023-12-18T10:00:00Z',
  },
  {
    id: '12',
    titulo: 'Terreno Comercial na Rodovia',
    slug: 'terreno-comercial-rodovia',
    descricao: 'Amplo terreno comercial com frente para rodovia estadual. Ideal para galpão, posto de combustíveis ou empreendimento comercial. Documentação em dia.',
    finalidade: 'venda',
    status: 'publicado',
    destaque: false,
    tipo: 'Terreno Comercial',
    categoriaId: '3',
    cidade: 'Jundiaí',
    bairro: 'Distrito Industrial',
    endereco: 'Rod. Anhanguera, km 52',
    preco: 3500000,
    areaTotal: 5000,
    quartos: 0,
    suites: 0,
    banheiros: 0,
    vagas: 0,
    mobiliado: false,
    aceitaPermuta: false,
    codigoInterno: 'EA-1012',
    contatoWhatsapp: '5511999999999',
    images: [
      { id: '13', url: terreno1, ordem: 1, isCover: true },
    ],
    createdAt: '2023-12-15T10:00:00Z',
    updatedAt: '2023-12-15T10:00:00Z',
  },
];

export const leads: Lead[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@email.com',
    telefone: '11987654321',
    mensagem: 'Tenho interesse no apartamento dos Jardins. Gostaria de agendar uma visita.',
    origem: 'imovel',
    propertyId: '1',
    status: 'novo',
    createdAt: '2024-01-16T14:30:00Z',
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@email.com',
    telefone: '11976543210',
    mensagem: 'Quero anunciar minha casa de 3 quartos em Pinheiros.',
    origem: 'anuncie',
    status: 'em_contato',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    nome: 'Carlos Oliveira',
    email: 'carlos@empresa.com.br',
    telefone: '11965432109',
    mensagem: 'Preciso de uma sala comercial na Faria Lima para minha empresa.',
    origem: 'contato',
    status: 'fechado',
    createdAt: '2024-01-14T09:00:00Z',
  },
];

export const users: User[] = [
  {
    id: '1',
    nome: 'Erik Azevedo',
    email: 'admin@site.com',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nome: 'Editor Teste',
    email: 'editor@site.com',
    role: 'editor',
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const getCategoryById = (id: string) => categories.find(c => c.id === id);
export const getCategoryBySlug = (slug: string) => categories.find(c => c.slug === slug);
export const getPropertyById = (id: string) => properties.find(p => p.id === id);
export const getPropertyBySlug = (slug: string) => properties.find(p => p.slug === slug);
export const getPropertiesByCategory = (categoryId: string) => properties.filter(p => p.categoriaId === categoryId);
export const getFeaturedProperties = () => properties.filter(p => p.destaque && p.status === 'publicado');
export const getPublishedProperties = () => properties.filter(p => p.status === 'publicado');

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatArea = (area: number) => {
  if (area >= 10000) {
    return `${(area / 10000).toLocaleString('pt-BR')} ha`;
  }
  return `${area.toLocaleString('pt-BR')} m²`;
};
