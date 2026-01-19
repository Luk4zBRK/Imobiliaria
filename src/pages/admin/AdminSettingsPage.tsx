import { useEffect, useState } from 'react';
import { Save, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Setting {
  id: string;
  key: string;
  value: string | null;
  type: string;
  label: string;
  category: string;
}

interface SettingsByCategory {
  [category: string]: Setting[];
}

const categoryLabels: Record<string, string> = {
  contato: 'Contato',
  social: 'Redes Sociais',
  banner: 'Banner Principal',
  seo: 'SEO',
  sobre: 'Página Sobre',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category, key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Erro ao carregar configurações');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setChanges(prev => ({ ...prev, [key]: value }));
  };

  const getValue = (setting: Setting) => {
    return changes[setting.key] !== undefined ? changes[setting.key] : (setting.value || '');
  };

  const handleImageUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${key}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('site-assets')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from('site-assets')
        .getPublicUrl(fileName);

      handleChange(key, publicUrl.publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploadingKey(null);
    }
  };

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) {
      toast.info('Nenhuma alteração para salvar');
      return;
    }

    setSaving(true);
    try {
      for (const [key, value] of Object.entries(changes)) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value })
          .eq('key', key);

        if (error) throw error;
      }

      toast.success('Configurações salvas com sucesso!');
      setChanges({});
      fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const settingsByCategory = settings.reduce<SettingsByCategory>((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {});

  const categories = Object.keys(settingsByCategory);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (settings.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Configurações do Site</h1>
            <p className="text-muted-foreground mt-1">Nenhuma configuração encontrada.</p>
          </div>
          <Button onClick={fetchSettings} variant="outline" className="gap-2">
            <Loader2 className="h-4 w-4" />
            Recarregar
          </Button>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <p className="text-muted-foreground">
            Verifique se a tabela <span className="font-semibold">site_settings</span> possui registros e se o usuário tem permissão de leitura (is_admin_or_editor). Se os dados já existem, clique em "Recarregar".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Configurações do Site</h1>
          <p className="text-muted-foreground mt-1">Gerencie as informações exibidas no site</p>
        </div>
        <Button 
          onClick={handleSave} 
          className="btn-gold gap-2"
          disabled={saving || Object.keys(changes).length === 0}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </div>

      {Object.keys(changes).length > 0 && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 text-sm text-warning-foreground">
          Você tem {Object.keys(changes).length} alteração(ões) não salva(s).
        </div>
      )}

      <Tabs defaultValue={categories[0]} className="space-y-6">
        <TabsList className="flex-wrap h-auto gap-2">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="px-4">
              {categoryLabels[category] || category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category} value={category}>
            <div className="bg-card rounded-xl p-6 border border-border space-y-6">
              <h2 className="font-display text-xl font-semibold">
                {categoryLabels[category] || category}
              </h2>

              <div className="grid gap-6">
                {settingsByCategory[category].map(setting => (
                  <div key={setting.key}>
                    <Label htmlFor={setting.key}>{setting.label}</Label>
                    
                    {setting.type === 'image' ? (
                      <div className="mt-2 space-y-3">
                        {getValue(setting) && (
                          <div className="relative w-full max-w-md">
                            <img
                              src={getValue(setting)}
                              alt={setting.label}
                              className="w-full h-40 object-cover rounded-lg border border-border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={() => handleChange(setting.key, '')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            id={`file-${setting.key}`}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(setting.key, file);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => document.getElementById(`file-${setting.key}`)?.click()}
                            disabled={uploadingKey === setting.key}
                            className="gap-2"
                          >
                            {uploadingKey === setting.key ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="h-4 w-4" />
                            )}
                            {uploadingKey === setting.key ? 'Enviando...' : 'Enviar Imagem'}
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            JPG, PNG, WebP ou GIF (máx. 10MB)
                          </span>
                        </div>
                      </div>
                    ) : setting.key.includes('texto') || setting.key.includes('descricao') ? (
                      <Textarea
                        id={setting.key}
                        value={getValue(setting)}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        rows={4}
                        className="mt-1"
                      />
                    ) : (
                      <Input
                        id={setting.key}
                        value={getValue(setting)}
                        onChange={(e) => handleChange(setting.key, e.target.value)}
                        className="mt-1 max-w-xl"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
