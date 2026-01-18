import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const content = [
    `A sua privacidade é importante para nós. É política do Azevedo Corretor de Imóveis respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Azevedo Corretor de Imóveis, e outros sites que possuímos e operamos.`,
    `Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.`,
    `Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.`,
    `Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.`,
    `O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.`,
    `Você é livre para recusar a nossa solicitação de informações pessoais, entendendo que talvez não possamos fornecer alguns dos serviços desejados.`,
    `O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contacto connosco.`,
    `O serviço Google AdSense que usamos para veicular publicidade usa um cookie DoubleClick para veicular anúncios mais relevantes em toda a Web e limitar o número de vezes que um determinado anúncio é exibido para você. Para mais informações sobre o Google AdSense, consulte as FAQs oficiais sobre privacidade do Google AdSense. Utilizamos anúncios para compensar os custos de funcionamento deste site e fornecer financiamento para futuros desenvolvimentos. Os cookies de publicidade comportamental usados ​​por este site foram projetados para garantir que você forneça os anúncios mais relevantes sempre que possível, rastreando anonimamente seus interesses e apresentando coisas semelhantes que possam ser do seu interesse. Vários parceiros anunciam em nosso nome e os cookies de rastreamento de afiliados simplesmente nos permitem ver se nossos clientes acessaram o site através de um dos sites de nossos parceiros, para que possamos creditá-los adequadamente e, quando aplicável, permitir que nossos parceiros afiliados ofereçam qualquer promoção que pode fornecê-lo para fazer uma compra.`,
  ];

  const userCommitments = [
    'Não se envolver em atividades que sejam ilegais ou contrárias à boa fé e à ordem pública;',
    'Não difundir propaganda ou conteúdo de natureza racista, xenofóbica, jogos de sorte ou azar, qualquer tipo de pornografia ilegal, de apologia ao terrorismo ou contra os direitos humanos;',
    'Não causar danos aos sistemas físicos (hardwares) e lógicos (softwares) do Azevedo Corretor de Imóveis, de seus fornecedores ou terceiros, nem introduzir ou disseminar vírus informáticos ou quaisquer outros sistemas capazes de causar danos.',
  ];

  return (
    <>
      <SEO title="Política de Privacidade" description="Saiba como tratamos seus dados pessoais." />

      <div className="min-h-screen bg-muted/30">
        <section className="bg-background border-b border-border py-12">
          <div className="container-custom text-center">
            <motion.h1
              className="section-title mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Política de Privacidade
            </motion.h1>
            <motion.p
              className="section-subtitle mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Transparência sobre o tratamento dos seus dados ao usar nosso site.
            </motion.p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-custom max-w-4xl space-y-8">
            <motion.div
              className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="prose prose-lg text-muted-foreground space-y-4">
                {content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h2 className="font-display text-xl font-semibold">Compromisso do Usuário</h2>
              <ul className="space-y-2 text-muted-foreground leading-relaxed list-disc pl-5">
                {userCommitments.map((item) => (
                  <li key={item} className="text-sm sm:text-base">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="text-sm text-muted-foreground text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="mb-2">
                Mais informações: se houver algo que você não tem certeza se precisa ou não, mantenha os cookies ativados caso interaja com recursos do site.
              </p>
              <p>Esta política é efetiva a partir de 18 Janeiro de 2026 às 23:44.</p>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
