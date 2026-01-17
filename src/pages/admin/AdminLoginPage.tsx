import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { z } from 'zod';
import logo from '@/assets/logo.png';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const signupSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

type FormMode = 'login' | 'signup' | 'forgot-password';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<FormMode>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (mode === 'signup') {
        signupSchema.parse({ nome, email, password });
      } else if (mode === 'forgot-password') {
        forgotPasswordSchema.parse({ email });
      } else {
        loginSchema.parse({ email, password });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'forgot-password') {
        const { error } = await resetPassword(email);

        if (error) {
          toast.error(error.message || 'Erro ao enviar email de recuperação');
        } else {
          setResetEmailSent(true);
          toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
        }
      } else if (mode === 'signup') {
        const { error } = await signUp(email, password, nome);

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('Este email já está cadastrado');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Conta criada! Agora um administrador precisa liberar seu acesso.');
          setMode('login');
          setNome('');
          setPassword('');
        }
      } else {
        const { error } = await signIn(email, password);

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Login realizado com sucesso!');
          navigate('/admin');
        }
      }
    } catch (err) {
      toast.error(mode === 'signup' ? 'Erro ao criar conta' : mode === 'forgot-password' ? 'Erro ao enviar email' : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (newMode: FormMode) => {
    setMode(newMode);
    setErrors({});
    setResetEmailSent(false);
  };

  const getTitle = () => {
    switch (mode) {
      case 'signup':
        return 'Crie sua conta para solicitar acesso';
      case 'forgot-password':
        return 'Digite seu email para recuperar sua senha';
      default:
        return 'Faça login para acessar o painel';
    }
  };

  const getButtonText = () => {
    if (isLoading) {
      switch (mode) {
        case 'signup':
          return 'Criando conta...';
        case 'forgot-password':
          return 'Enviando...';
        default:
          return 'Entrando...';
      }
    }
    switch (mode) {
      case 'signup':
        return 'Criar Conta';
      case 'forgot-password':
        return 'Enviar Link de Recuperação';
      default:
        return 'Entrar';
    }
  };

  // Show success message for forgot password
  if (mode === 'forgot-password' && resetEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
            <div className="text-center">
              <img src={logo} alt="EA Corretor" className="h-16 mx-auto mb-4" />
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground mb-2">
                Email Enviado!
              </h1>
              <p className="text-muted-foreground mb-6">
                Enviamos um link de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada e spam.
              </p>
              <Button
                variant="outline"
                onClick={() => handleModeChange('login')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border">
          <div className="text-center mb-8">
            <img src={logo} alt="EA Corretor" className="h-16 mx-auto mb-4" />
            <h1 className="font-display text-2xl font-bold text-foreground">
              {mode === 'forgot-password' ? 'Recuperar Senha' : 'Área Administrativa'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {getTitle()}
            </p>
          </div>

          {mode === 'forgot-password' && (
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Voltar ao login
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div>
                <Label htmlFor="nome">Nome</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="nome"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Seu nome completo"
                    className={`pl-10 ${errors.nome ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                </div>
                {errors.nome && (
                  <p className="text-sm text-destructive mt-1">{errors.nome}</p>
                )}
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {mode !== 'forgot-password' && (
              <div>
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Senha</Label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeChange('forgot-password')}
                      className="text-sm text-primary hover:underline"
                    >
                      Esqueci minha senha
                    </button>
                  )}
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">{errors.password}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full btn-gold"
              disabled={isLoading}
            >
              {getButtonText()}
            </Button>
          </form>

          {mode !== 'forgot-password' && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => handleModeChange(mode === 'signup' ? 'login' : 'signup')}
                className="text-sm text-primary hover:underline"
              >
                {mode === 'signup' ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
              </button>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-4">
            <a href="/" className="hover:text-primary transition-colors">
              ← Voltar ao site
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
