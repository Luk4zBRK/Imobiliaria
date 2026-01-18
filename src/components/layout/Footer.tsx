import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Lock } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import logo from '@/assets/logo.png';

export function Footer() {
  const { data: categories = [] } = useCategories();

  return (
    <footer className="bg-navy text-secondary-foreground">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & About */}
          <div className="space-y-4">
            <img src={logo} alt="EA Corretor de Imóveis" className="h-14 w-auto" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              Especialista em imóveis de alto padrão. Encontre o imóvel dos seus sonhos com atendimento personalizado e exclusivo.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                href="https://www.instagram.com/azevedocorretorimoveis/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/Azevedocorretorerik"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">
              Links Rápidos
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Imóveis à Venda', href: '/imoveis?finalidade=venda' },
                { label: 'Imóveis para Alugar', href: '/imoveis?finalidade=aluguel' },
                { label: 'Lançamentos', href: '/imoveis?destaque=true' },
                { label: 'Anuncie seu Imóvel', href: '/anuncie' },
                { label: 'Sobre Nós', href: '/sobre' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">
              Categorias
            </h4>
            <ul className="space-y-3">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/imoveis?categoria=${cat.slug}`}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {cat.nome}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-muted-foreground text-sm">Nenhuma categoria disponível no momento.</li>
              )}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Rua Mal. Floriano Peixoto, 38 - Centro<br />Socorro - SP, 13960-000</span>
              </li>
              <li>
                <a
                  href="tel:+5519992372866"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  (19) 99237-2866
                </a>
              </li>
              <li>
                <a
                  href="mailto:erikazevedocorretor@gmail.com"
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  erikazevedocorretor@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} EA Corretor de Imóveis. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <Link to="/privacidade" className="hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/termos" className="hover:text-primary transition-colors">
                Termos de Uso
              </Link>
              <Link to="/admin/login" className="hover:text-primary transition-colors flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Área Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
