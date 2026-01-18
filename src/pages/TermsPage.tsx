import { SEO } from '@/components/SEO';
import { motion } from 'framer-motion';

export default function TermsPage() {
  const terms = [
    {
      title: '1. Termos',
      content:
        'Ao acessar ao site Azevedo Corretor de Imóveis, concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.',
    },
    {
      title: '2. Uso de Licença',
      content:
        'É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Azevedo Corretor de Imóveis , apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode: modificar ou copiar os materiais; usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial); tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Azevedo Corretor de Imóveis; remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou transferir os materiais para outra pessoa ou "espelhe" os materiais em qualquer outro servidor. Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Azevedo Corretor de Imóveis a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrónico ou impresso.',
    },
    {
      title: '3. Isenção de responsabilidade',
      content:
        'Os materiais no site da Azevedo Corretor de Imóveis são fornecidos "como estão". Azevedo Corretor de Imóveis não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos. Além disso, o Azevedo Corretor de Imóveis não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ​​ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.',
    },
    {
      title: '4. Limitações',
      content:
        'Em nenhum caso o Azevedo Corretor de Imóveis ou seus fornecedores serão responsáveis ​​por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais em Azevedo Corretor de Imóveis, mesmo que Azevedo Corretor de Imóveis ou um representante autorizado da Azevedo Corretor de Imóveis tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos conseqüentes ou incidentais, essas limitações podem não se aplicar a você.',
    },
    {
      title: '5. Precisão dos materiais',
      content:
        'Os materiais exibidos no site da Azevedo Corretor de Imóveis podem incluir erros técnicos, tipográficos ou fotográficos. Azevedo Corretor de Imóveis não garante que qualquer material em seu site seja preciso, completo ou atual. Azevedo Corretor de Imóveis pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, Azevedo Corretor de Imóveis não se compromete a atualizar os materiais.',
    },
    {
      title: '6. Links',
      content:
        'O Azevedo Corretor de Imóveis não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Azevedo Corretor de Imóveis do site. O uso de qualquer site vinculado é por conta e risco do usuário.',
    },
  ];

  return (
    <>
      <SEO title="Termos de Uso" description="Condições para uso do site e serviços." />

      <div className="min-h-screen bg-muted/30">
        <section className="bg-background border-b border-border py-12">
          <div className="container-custom text-center">
            <motion.h1
              className="section-title mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Termos de Uso
            </motion.h1>
            <motion.p
              className="section-subtitle mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Entenda as condições para utilizar nosso site e serviços.
            </motion.p>
          </div>
        </section>

        <section className="py-12">
          <div className="container-custom max-w-4xl space-y-8">
            {terms.map((item, index) => (
              <motion.div
                key={item.title}
                className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <h2 className="font-display text-xl font-semibold">{item.title}</h2>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {item.content}
                </p>
              </motion.div>
            ))}
            <p className="text-sm text-muted-foreground text-center">
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
