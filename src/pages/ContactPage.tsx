import { useState } from 'react';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';
import { z } from 'zod';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';

const contactSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().email('Email inválido').max(255),
  telefone: z.string().min(10, 'Telefone inválido').max(20),
  mensagem: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres').max(1000),
});

export default function ContactPage() {
  const { getSetting } = useSiteSettings();
  const contatoTelefone = getSetting('contato_telefone', '(19) 99237-2866');
  const contatoEmail = getSetting('contato_email', 'erikazevedocorretor@gmail.com');
  const contatoEndereco = getSetting(
    'contato_endereco',
    'Rua Mal. Floriano Peixoto, 38 - Centro, Socorro - SP, 13960-000'
  );
  const contatoHorario = getSetting('contato_horario', 'Seg a Sex: 9h às 18h | Sáb: 9h às 13h');

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      contactSchema.parse(formData);
      setIsSubmitting(true);
      
      // Save lead to database
      const { error } = await supabase.from('leads').insert({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        mensagem: formData.mensagem,
        origem: 'contato',
        status: 'novo',
      });

      if (error) throw error;
      
      toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.');
      setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
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
        toast.error('Erro ao enviar mensagem. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title="Contato"
        description="Entre em contato conosco. Estamos prontos para ajudá-lo a encontrar o imóvel dos seus sonhos."
      />

      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <section className="bg-background border-b border-border py-16">
          <div className="container-custom text-center">
            <motion.h1
              className="section-title mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Entre em Contato
            </motion.h1>
            <motion.p
              className="section-subtitle mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Estamos prontos para ajudá-lo a encontrar o imóvel perfeito
            </motion.p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-display text-2xl font-semibold mb-6">
                  Informações de Contato
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Endereço</h3>
                      <p className="text-muted-foreground">
                        {contatoEndereco}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {contatoHorario}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Telefone</h3>
                      <a
                        href={`tel:${contatoTelefone.replace(/\D/g, '')}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {contatoTelefone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a
                        href={`mailto:${contatoEmail}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {contatoEmail}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Mapa do Escritório */}
                <div className="mt-8 aspect-video rounded-xl overflow-hidden border border-border">
                  <iframe
                    title="Mapa do escritório"
                    src="https://www.google.com/maps?q=AZEVEDO+Corretor+de+Im%C3%B3veis&output=embed"
                    className="w-full h-full"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-card rounded-xl p-8 border border-border">
                  <h2 className="font-display text-2xl font-semibold mb-6">
                    Envie sua Mensagem
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
                        <Label htmlFor="telefone">Telefone</Label>
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
                      <Label htmlFor="mensagem">Mensagem</Label>
                      <Textarea
                        id="mensagem"
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleChange}
                        placeholder="Como podemos ajudá-lo?"
                        rows={5}
                        className={errors.mensagem ? 'border-destructive' : ''}
                      />
                      {errors.mensagem && (
                        <p className="text-sm text-destructive mt-1">{errors.mensagem}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-gold gap-2"
                      disabled={isSubmitting}
                    >
                      <Send className="h-4 w-4" />
                      {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                    </Button>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
