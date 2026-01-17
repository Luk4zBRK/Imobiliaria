import { useState } from 'react';
import { Home, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';
import { z } from 'zod';
import { useCategories } from '@/hooks/useCategories';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';

const advertiseSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  telefone: z.string().min(10, 'Telefone inválido').max(20),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  cidade: z.string().min(2, 'Cidade é obrigatória').max(100),
  bairro: z.string().min(2, 'Bairro é obrigatório').max(100),
  descricao: z.string().min(10, 'Descreva seu imóvel').max(2000),
});

export default function AdvertisePage() {
  const { data: categories = [] } = useCategories();
  const { getSetting } = useSiteSettings();
  const contatoWhatsapp = getSetting('contato_whatsapp', '5511999999999');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    categoria: '',
    cidade: '',
    bairro: '',
    descricao: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      advertiseSchema.parse(formData);
      setIsSubmitting(true);

      // Build message with all property details
      const mensagem = `
Categoria: ${formData.categoria}
Cidade: ${formData.cidade}
Bairro: ${formData.bairro}

Descrição:
${formData.descricao}
      `.trim();

      // Save lead to database
      const { error } = await supabase.from('leads').insert({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        mensagem: mensagem,
        origem: 'anuncie',
        status: 'novo',
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success('Solicitação enviada com sucesso!');
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        console.error('Error submitting form:', error);
        toast.error('Erro ao enviar solicitação. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <SEO
          title="Anuncie seu Imóvel"
          description="Anuncie seu imóvel conosco e encontre o comprador ou inquilino ideal."
        />
        <div className="min-h-screen flex items-center justify-center bg-muted/30 py-16">
          <motion.div
            className="text-center max-w-md mx-auto px-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h1 className="font-display text-3xl font-bold mb-4">
              Solicitação Enviada!
            </h1>
            <p className="text-muted-foreground mb-8">
              Recebemos sua solicitação e entraremos em contato em breve para avaliar
              seu imóvel e discutir as melhores estratégias de divulgação.
            </p>
            <a
              href={`https://wa.me/${contatoWhatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="btn-gold">Falar pelo WhatsApp</Button>
            </a>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Anuncie seu Imóvel"
        description="Anuncie seu imóvel conosco. Oferecemos avaliação gratuita e estratégias personalizadas para venda ou locação."
      />

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <section className="bg-background border-b border-border py-16">
          <div className="container-custom text-center">
            <motion.div
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Home className="h-8 w-8 text-primary" />
            </motion.div>
            <motion.h1
              className="section-title mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Anuncie seu Imóvel
            </motion.h1>
            <motion.p
              className="section-subtitle mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Conte com nossa experiência para vender ou alugar seu imóvel com rapidez
              e segurança
            </motion.p>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-12 bg-background">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Avaliação Gratuita',
                  description:
                    'Realizamos uma avaliação completa e gratuita do seu imóvel.',
                },
                {
                  title: 'Divulgação Premium',
                  description:
                    'Seu imóvel nos principais portais e redes sociais.',
                },
                {
                  title: 'Atendimento Personalizado',
                  description:
                    'Acompanhamento dedicado em todas as etapas do processo.',
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  className="text-center p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-16">
          <div className="container-custom max-w-2xl">
            <motion.div
              className="bg-card rounded-xl p-8 border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="font-display text-2xl font-semibold mb-6 text-center">
                Preencha os dados do seu imóvel
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className={errors.nome ? 'border-destructive' : ''}
                  />
                  {errors.nome && (
                    <p className="text-sm text-destructive mt-1">{errors.nome}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone / WhatsApp</Label>
                    <Input
                      id="telefone"
                      name="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={handleChange}
                      placeholder="(11) 99999-9999"
                      className={errors.telefone ? 'border-destructive' : ''}
                    />
                    {errors.telefone && (
                      <p className="text-sm text-destructive mt-1">{errors.telefone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Categoria do Imóvel</Label>
                  <Select
                    value={formData.categoria}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, categoria: value }))
                    }
                  >
                    <SelectTrigger
                      className={errors.categoria ? 'border-destructive' : ''}
                    >
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.nome}>
                          {cat.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoria && (
                    <p className="text-sm text-destructive mt-1">{errors.categoria}</p>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      name="cidade"
                      value={formData.cidade}
                      onChange={handleChange}
                      placeholder="São Paulo"
                      className={errors.cidade ? 'border-destructive' : ''}
                    />
                    {errors.cidade && (
                      <p className="text-sm text-destructive mt-1">{errors.cidade}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      name="bairro"
                      value={formData.bairro}
                      onChange={handleChange}
                      placeholder="Jardins"
                      className={errors.bairro ? 'border-destructive' : ''}
                    />
                    {errors.bairro && (
                      <p className="text-sm text-destructive mt-1">{errors.bairro}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição do Imóvel</Label>
                  <Textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Descreva seu imóvel: quantidade de quartos, área, diferenciais..."
                    rows={5}
                    className={errors.descricao ? 'border-destructive' : ''}
                  />
                  {errors.descricao && (
                    <p className="text-sm text-destructive mt-1">{errors.descricao}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full btn-gold gap-2"
                  disabled={isSubmitting}
                >
                  <Send className="h-4 w-4" />
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitação'}
                </Button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
