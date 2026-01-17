import { Award, Users, Target, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import logo from '@/assets/logo.png';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Confiança',
      description:
        'Construímos relações baseadas na transparência e honestidade em cada negociação.',
    },
    {
      icon: Award,
      title: 'Excelência',
      description:
        'Buscamos sempre superar as expectativas com atendimento e serviços de alta qualidade.',
    },
    {
      icon: Users,
      title: 'Relacionamento',
      description:
        'Valorizamos cada cliente e construímos parcerias duradouras.',
    },
    {
      icon: Target,
      title: 'Resultados',
      description:
        'Focamos em alcançar os melhores resultados para nossos clientes.',
    },
  ];

  return (
    <>
      <SEO
        title="Sobre"
        description="Conheça a EA Corretor de Imóveis. Mais de 15 anos de experiência no mercado imobiliário de alto padrão."
      />

      <div className="min-h-screen">
        {/* Hero */}
        <section className="bg-navy py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <motion.img
                src={logo}
                alt="EA Corretor de Imóveis"
                className="h-20 w-auto mx-auto mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              />
              <motion.h1
                className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Sobre a EA Corretor
              </motion.h1>
              <motion.p
                className="text-lg text-primary-foreground/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Há mais de 15 anos transformando sonhos em realidade no mercado
                imobiliário de alto padrão.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title mb-6">Nossa História</h2>
                <div className="prose prose-lg text-muted-foreground space-y-4">
                  <p>
                    A EA Corretor de Imóveis nasceu da paixão por conectar pessoas aos
                    seus imóveis ideais. Fundada por Erik Azevedo, a empresa se
                    consolidou como referência no mercado imobiliário de alto padrão
                    em São Paulo e região.
                  </p>
                  <p>
                    Ao longo de mais de 15 anos, construímos uma trajetória marcada
                    pela excelência no atendimento, conhecimento profundo do mercado e
                    compromisso inabalável com a satisfação dos nossos clientes.
                  </p>
                  <p>
                    Hoje, contamos com uma equipe especializada e uma carteira
                    diversificada de imóveis, desde apartamentos de luxo até fazendas
                    e propriedades comerciais. Nossa missão é simples: transformar a
                    busca pelo imóvel perfeito em uma experiência prazerosa e
                    bem-sucedida.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-muted">
          <div className="container-custom">
            <div className="text-center mb-12">
              <motion.h2
                className="section-title mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Nossos Valores
              </motion.h2>
              <motion.p
                className="section-subtitle mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Os princípios que guiam nosso trabalho todos os dias
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  className="bg-card rounded-xl p-6 border border-border text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary/5">
          <div className="container-custom text-center">
            <motion.h2
              className="section-title mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Pronto para encontrar seu imóvel?
            </motion.h2>
            <motion.p
              className="text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Entre em contato conosco e descubra como podemos ajudá-lo a realizar
              o sonho do imóvel ideal.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 rounded-lg btn-gold text-base font-medium"
              >
                Falar com Especialista
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
