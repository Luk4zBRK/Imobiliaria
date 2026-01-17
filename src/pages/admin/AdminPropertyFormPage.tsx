import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { ImageUpload, PropertyImage } from '@/components/admin/ImageUpload';

interface Category {
  id: string;
  nome: string;
  slug: string;
}

interface PropertyForm {
  titulo: string;
  slug: string;
  descricao: string;
  finalidade: string;
  status: string;
  destaque: boolean;
  tipo: string;
  categoria_id: string;
  cidade: string;
  bairro: string;
  endereco: string;
  preco: string;
  preco_locacao: string;
  condominio: string;
  iptu: string;
  area_total: string;
  area_construida: string;
  quartos: string;
  suites: string;
  banheiros: string;
  vagas: string;
  mobiliado: boolean;
  aceita_permuta: boolean;
  codigo_interno: string;
  codigo_portal: string;
  codigo_crm: string;
  codigo_externo: string;
  seo_title: string;
  seo_description: string;
  contato_whatsapp: string;
  contato_telefone: string;
  contato_email: string;
}

const initialForm: PropertyForm = {
  titulo: '',
  slug: '',
  descricao: '',
  finalidade: 'venda',
  status: 'rascunho',
  destaque: false,
  tipo: '',
  categoria_id: '',
  cidade: '',
  bairro: '',
  endereco: '',
  preco: '',
  preco_locacao: '',
  condominio: '',
  iptu: '',
  area_total: '',
  area_construida: '',
  quartos: '0',
  suites: '0',
  banheiros: '0',
  vagas: '0',
  mobiliado: false,
  aceita_permuta: false,
  codigo_interno: '',
  codigo_portal: '',
  codigo_crm: '',
  codigo_externo: '',
  seo_title: '',
  seo_description: '',
  contato_whatsapp: '',
  contato_telefone: '',
  contato_email: '',
};

export default function AdminPropertyFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  
  const [form, setForm] = useState<PropertyForm>(initialForm);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [images, setImages] = useState<PropertyImage[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('ordem');
      if (data) setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      const fetchProperty = async () => {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .maybeSingle();

        if (error || !data) {
          toast.error('Imóvel não encontrado');
          navigate('/admin/imoveis');
          return;
        }

        setForm({
          titulo: data.titulo || '',
          slug: data.slug || '',
          descricao: data.descricao || '',
          finalidade: data.finalidade || 'venda',
          status: data.status || 'rascunho',
          destaque: data.destaque || false,
          tipo: data.tipo || '',
          categoria_id: data.categoria_id || '',
          cidade: data.cidade || '',
          bairro: data.bairro || '',
          endereco: data.endereco || '',
          preco: data.preco?.toString() || '',
          preco_locacao: data.preco_locacao?.toString() || '',
          condominio: data.condominio?.toString() || '',
          iptu: data.iptu?.toString() || '',
          area_total: data.area_total?.toString() || '',
          area_construida: data.area_construida?.toString() || '',
          quartos: data.quartos?.toString() || '0',
          suites: data.suites?.toString() || '0',
          banheiros: data.banheiros?.toString() || '0',
          vagas: data.vagas?.toString() || '0',
          mobiliado: data.mobiliado || false,
          aceita_permuta: data.aceita_permuta || false,
          codigo_interno: data.codigo_interno || '',
          codigo_portal: data.codigo_portal || '',
          codigo_crm: data.codigo_crm || '',
          codigo_externo: data.codigo_externo || '',
          seo_title: data.seo_title || '',
          seo_description: data.seo_description || '',
          contato_whatsapp: data.contato_whatsapp || '',
          contato_telefone: data.contato_telefone || '',
          contato_email: data.contato_email || '',
        });

        // Fetch property images
        const { data: imagesData } = await supabase
          .from('property_images')
          .select('*')
          .eq('property_id', id)
          .order('ordem');

        if (imagesData) {
          setImages(imagesData.map(img => ({
            id: img.id,
            url: img.url,
            is_cover: img.is_cover,
            ordem: img.ordem,
          })));
        }

        setLoadingData(false);
      };
      fetchProperty();
    }
  }, [id, isEditing, navigate]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const titulo = e.target.value;
    setForm(prev => ({
      ...prev,
      titulo,
      slug: generateSlug(titulo),
    }));
  };

  const handleChange = (field: keyof PropertyForm, value: string | boolean) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.titulo || !form.cidade || !form.bairro || !form.tipo || !form.codigo_interno || !form.preco || !form.area_total) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const propertyData = {
        titulo: form.titulo,
        slug: form.slug || generateSlug(form.titulo),
        descricao: form.descricao || null,
        finalidade: form.finalidade,
        status: form.status,
        destaque: form.destaque,
        tipo: form.tipo,
        categoria_id: form.categoria_id || null,
        cidade: form.cidade,
        bairro: form.bairro,
        endereco: form.endereco || null,
        preco: parseFloat(form.preco) || 0,
        preco_locacao: form.preco_locacao ? parseFloat(form.preco_locacao) : null,
        condominio: form.condominio ? parseFloat(form.condominio) : null,
        iptu: form.iptu ? parseFloat(form.iptu) : null,
        area_total: parseFloat(form.area_total) || 0,
        area_construida: form.area_construida ? parseFloat(form.area_construida) : null,
        quartos: parseInt(form.quartos) || 0,
        suites: parseInt(form.suites) || 0,
        banheiros: parseInt(form.banheiros) || 0,
        vagas: parseInt(form.vagas) || 0,
        mobiliado: form.mobiliado,
        aceita_permuta: form.aceita_permuta,
        codigo_interno: form.codigo_interno,
        codigo_portal: form.codigo_portal || null,
        codigo_crm: form.codigo_crm || null,
        codigo_externo: form.codigo_externo || null,
        seo_title: form.seo_title || null,
        seo_description: form.seo_description || null,
        contato_whatsapp: form.contato_whatsapp || null,
        contato_telefone: form.contato_telefone || null,
        contato_email: form.contato_email || null,
        created_by: user?.id,
      };

      let propertyId = id;

      if (isEditing && id) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('properties')
          .insert([propertyData])
          .select('id')
          .single();
        if (error) throw error;
        propertyId = data.id;
      }

      // Upload images
      if (propertyId && images.length > 0) {
        await saveImages(propertyId);
      }

      toast.success(isEditing ? 'Imóvel atualizado com sucesso!' : 'Imóvel cadastrado com sucesso!');
      navigate('/admin/imoveis');
    } catch (error: any) {
      console.error('Error saving property:', error);
      if (error.code === '23505') {
        toast.error('Código interno já existe. Use um código diferente.');
      } else {
        toast.error('Erro ao salvar imóvel');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveImages = async (propertyId: string) => {
    try {
      // Get existing images to compare
      const { data: existingImages } = await supabase
        .from('property_images')
        .select('id')
        .eq('property_id', propertyId);

      const existingIds = existingImages?.map(img => img.id) || [];
      const currentIds = images.filter(img => img.id).map(img => img.id);
      
      // Delete removed images
      const toDelete = existingIds.filter(id => !currentIds.includes(id));
      if (toDelete.length > 0) {
        await supabase
          .from('property_images')
          .delete()
          .in('id', toDelete);
      }

      // Upload new images and update existing ones
      for (const image of images) {
        if (image.isNew && image.file) {
          const fileExt = image.file.name.split('.').pop();
          const fileName = `${propertyId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('property-images')
            .upload(fileName, image.file);

          if (uploadError) {
            console.error('Upload error:', uploadError);
            continue;
          }

          const { data: publicUrl } = supabase.storage
            .from('property-images')
            .getPublicUrl(fileName);

          await supabase
            .from('property_images')
            .insert({
              property_id: propertyId,
              url: publicUrl.publicUrl,
              is_cover: image.is_cover,
              ordem: image.ordem,
            });
        } else if (image.id) {
          await supabase
            .from('property_images')
            .update({
              is_cover: image.is_cover,
              ordem: image.ordem,
            })
            .eq('id', image.id);
        }
      }
    } catch (error) {
      console.error('Error saving images:', error);
    }
  };

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/imoveis')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            {isEditing ? 'Editar Imóvel' : 'Novo Imóvel'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Altere os dados do imóvel' : 'Preencha os dados do novo imóvel'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Informações Básicas</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={handleTitleChange}
                placeholder="Ex: Apartamento Luxuoso com Vista Panorâmica"
                required
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="apartamento-luxuoso-vista"
              />
            </div>

            <div>
              <Label htmlFor="codigo_interno">Código Interno *</Label>
              <Input
                id="codigo_interno"
                value={form.codigo_interno}
                onChange={(e) => handleChange('codigo_interno', e.target.value)}
                placeholder="Ex: EA-1001"
                required
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo *</Label>
              <Input
                id="tipo"
                value={form.tipo}
                onChange={(e) => handleChange('tipo', e.target.value)}
                placeholder="Ex: Apartamento, Casa, Cobertura"
                required
              />
            </div>

            <div>
              <Label>Categoria</Label>
              <Select value={form.categoria_id} onValueChange={(v) => handleChange('categoria_id', v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Finalidade *</Label>
              <Select value={form.finalidade} onValueChange={(v) => handleChange('finalidade', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="aluguel">Aluguel</SelectItem>
                  <SelectItem value="temporada">Temporada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => handleChange('status', v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rascunho">Rascunho</SelectItem>
                  <SelectItem value="publicado">Publicado</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="alugado">Alugado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={form.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
                placeholder="Descrição completa do imóvel..."
                rows={5}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="destaque"
                  checked={form.destaque}
                  onCheckedChange={(v) => handleChange('destaque', v)}
                />
                <Label htmlFor="destaque">Destaque na Home</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Imagens</h2>
          <p className="text-sm text-muted-foreground -mt-4">
            Adicione fotos do imóvel. A primeira imagem marcada com estrela será a capa.
          </p>
          <ImageUpload
            propertyId={id}
            images={images}
            onChange={setImages}
            disabled={loading}
          />
        </div>

        {/* Location */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Localização</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                value={form.cidade}
                onChange={(e) => handleChange('cidade', e.target.value)}
                placeholder="São Paulo"
                required
              />
            </div>

            <div>
              <Label htmlFor="bairro">Bairro *</Label>
              <Input
                id="bairro"
                value={form.bairro}
                onChange={(e) => handleChange('bairro', e.target.value)}
                placeholder="Jardins"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input
                id="endereco"
                value={form.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                placeholder="Rua, número, complemento"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Valores</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="preco">Preço de Venda *</Label>
              <Input
                id="preco"
                type="number"
                value={form.preco}
                onChange={(e) => handleChange('preco', e.target.value)}
                placeholder="0"
                required
              />
            </div>

            <div>
              <Label htmlFor="preco_locacao">Valor Locação</Label>
              <Input
                id="preco_locacao"
                type="number"
                value={form.preco_locacao}
                onChange={(e) => handleChange('preco_locacao', e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="condominio">Condomínio</Label>
              <Input
                id="condominio"
                type="number"
                value={form.condominio}
                onChange={(e) => handleChange('condominio', e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="iptu">IPTU</Label>
              <Input
                id="iptu"
                type="number"
                value={form.iptu}
                onChange={(e) => handleChange('iptu', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>
        </div>

        {/* Characteristics */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Características</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <Label htmlFor="area_total">Área Total (m²) *</Label>
              <Input
                id="area_total"
                type="number"
                value={form.area_total}
                onChange={(e) => handleChange('area_total', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="area_construida">Área Construída</Label>
              <Input
                id="area_construida"
                type="number"
                value={form.area_construida}
                onChange={(e) => handleChange('area_construida', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="quartos">Quartos</Label>
              <Input
                id="quartos"
                type="number"
                value={form.quartos}
                onChange={(e) => handleChange('quartos', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="suites">Suítes</Label>
              <Input
                id="suites"
                type="number"
                value={form.suites}
                onChange={(e) => handleChange('suites', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="banheiros">Banheiros</Label>
              <Input
                id="banheiros"
                type="number"
                value={form.banheiros}
                onChange={(e) => handleChange('banheiros', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="vagas">Vagas</Label>
              <Input
                id="vagas"
                type="number"
                value={form.vagas}
                onChange={(e) => handleChange('vagas', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="mobiliado"
                checked={form.mobiliado}
                onCheckedChange={(v) => handleChange('mobiliado', v)}
              />
              <Label htmlFor="mobiliado">Mobiliado</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="aceita_permuta"
                checked={form.aceita_permuta}
                onCheckedChange={(v) => handleChange('aceita_permuta', v)}
              />
              <Label htmlFor="aceita_permuta">Aceita Permuta</Label>
            </div>
          </div>
        </div>

        {/* Codes */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Códigos Adicionais</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="codigo_portal">Código Portal</Label>
              <Input
                id="codigo_portal"
                value={form.codigo_portal}
                onChange={(e) => handleChange('codigo_portal', e.target.value)}
                placeholder="Ex: ZAP-12345"
              />
            </div>

            <div>
              <Label htmlFor="codigo_crm">Código CRM</Label>
              <Input
                id="codigo_crm"
                value={form.codigo_crm}
                onChange={(e) => handleChange('codigo_crm', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="codigo_externo">Código Externo</Label>
              <Input
                id="codigo_externo"
                value={form.codigo_externo}
                onChange={(e) => handleChange('codigo_externo', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">Contato</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="contato_whatsapp">WhatsApp</Label>
              <Input
                id="contato_whatsapp"
                value={form.contato_whatsapp}
                onChange={(e) => handleChange('contato_whatsapp', e.target.value)}
                placeholder="5511999999999"
              />
            </div>

            <div>
              <Label htmlFor="contato_telefone">Telefone</Label>
              <Input
                id="contato_telefone"
                value={form.contato_telefone}
                onChange={(e) => handleChange('contato_telefone', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contato_email">Email</Label>
              <Input
                id="contato_email"
                type="email"
                value={form.contato_email}
                onChange={(e) => handleChange('contato_email', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-card rounded-xl p-6 border border-border space-y-6">
          <h2 className="font-display text-xl font-semibold">SEO</h2>
          
          <div className="grid gap-4">
            <div>
              <Label htmlFor="seo_title">Título SEO</Label>
              <Input
                id="seo_title"
                value={form.seo_title}
                onChange={(e) => handleChange('seo_title', e.target.value)}
                placeholder="Título para mecanismos de busca"
              />
            </div>

            <div>
              <Label htmlFor="seo_description">Descrição SEO</Label>
              <Textarea
                id="seo_description"
                value={form.seo_description}
                onChange={(e) => handleChange('seo_description', e.target.value)}
                placeholder="Descrição para mecanismos de busca (máx. 160 caracteres)"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/imoveis')}>
            Cancelar
          </Button>
          <Button type="submit" className="btn-gold gap-2" disabled={loading}>
            <Save className="h-4 w-4" />
            {loading ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
          </Button>
        </div>
      </form>
    </div>
  );
}
