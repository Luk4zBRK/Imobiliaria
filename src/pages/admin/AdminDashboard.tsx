import { useEffect, useState, useMemo } from 'react';
import { Building2, Users, MessageSquare, TrendingUp, Home, FileText, ArrowUpRight, Plus, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { format, subDays, startOfDay, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface DashboardStats {
  totalProperties: number;
  publishedProperties: number;
  draftProperties: number;
  totalLeads: number;
  newLeads: number;
  totalCategories: number;
}

interface ChartData {
  date: string;
  fullDate: string;
  leads: number;
  imoveis: number;
}

interface PropertyData {
  id: string;
  status: string;
  created_at: string;
}

interface LeadData {
  id: string;
  status: string;
  created_at: string;
}

type PeriodOption = 7 | 30 | 90;

const periodOptions: { value: PeriodOption; label: string }[] = [
  { value: 7, label: '7 dias' },
  { value: 30, label: '30 dias' },
  { value: 90, label: '90 dias' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    publishedProperties: 0,
    draftProperties: 0,
    totalLeads: 0,
    newLeads: 0,
    totalCategories: 0,
  });
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodOption>(30);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [propertiesRes, leadsRes, categoriesRes] = await Promise.all([
          supabase.from('properties').select('id, status, created_at'),
          supabase.from('leads').select('id, status, created_at'),
          supabase.from('categories').select('id'),
        ]);

        const propertiesData = propertiesRes.data || [];
        const leadsData = leadsRes.data || [];
        const categories = categoriesRes.data || [];

        setProperties(propertiesData);
        setLeads(leadsData);

        setStats({
          totalProperties: propertiesData.length,
          publishedProperties: propertiesData.filter(p => p.status === 'publicado').length,
          draftProperties: propertiesData.filter(p => p.status === 'rascunho').length,
          totalLeads: leadsData.length,
          newLeads: leadsData.filter(l => l.status === 'novo').length,
          totalCategories: categories.length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Generate chart data based on selected period
  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const startDate = subDays(today, selectedPeriod - 1);
    const dateRange = eachDayOfInterval({ start: startDate, end: today });

    return dateRange.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const leadsCount = leads.filter(l => 
        format(new Date(l.created_at), 'yyyy-MM-dd') === dateStr
      ).length;
      const propertiesCount = properties.filter(p => 
        format(new Date(p.created_at), 'yyyy-MM-dd') === dateStr
      ).length;

      // Adjust date format based on period
      const dateFormat = selectedPeriod === 7 ? 'EEE' : selectedPeriod === 90 ? 'dd/MM' : 'dd/MM';

      return {
        date: format(date, dateFormat, { locale: ptBR }),
        fullDate: format(date, 'dd/MM/yyyy', { locale: ptBR }),
        leads: leadsCount,
        imoveis: propertiesCount,
      };
    });
  }, [leads, properties, selectedPeriod]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Data', 'Leads', 'Imóveis'];
    const csvContent = [
      headers.join(','),
      ...chartData.map(row => `${row.fullDate},${row.leads},${row.imoveis}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-${selectedPeriod}-dias-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246);
    doc.text('Relatório de Desempenho', 14, 22);
    
    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Período: Últimos ${selectedPeriod} dias`, 14, 32);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 14, 40);
    
    // Stats Summary
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Resumo', 14, 55);
    
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    const totalLeadsPeriod = chartData.reduce((acc, row) => acc + row.leads, 0);
    const totalImoveisPeriod = chartData.reduce((acc, row) => acc + row.imoveis, 0);
    
    doc.text(`Total de Leads no período: ${totalLeadsPeriod}`, 14, 65);
    doc.text(`Total de Imóveis cadastrados no período: ${totalImoveisPeriod}`, 14, 73);
    doc.text(`Total geral de Leads: ${stats.totalLeads}`, 14, 81);
    doc.text(`Total geral de Imóveis: ${stats.totalProperties}`, 14, 89);
    
    // Table
    doc.autoTable({
      startY: 100,
      head: [['Data', 'Leads', 'Imóveis']],
      body: chartData.map(row => [row.fullDate, row.leads.toString(), row.imoveis.toString()]),
      theme: 'striped',
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
    });
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    doc.save(`relatorio-${selectedPeriod}-dias-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const statCards = [
    {
      title: 'Total de Imóveis',
      value: stats.totalProperties,
      icon: Building2,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/5',
    },
    {
      title: 'Publicados',
      value: stats.publishedProperties,
      icon: Home,
      gradient: 'from-emerald-500 to-emerald-600',
      bgGradient: 'from-emerald-500/10 to-emerald-600/5',
    },
    {
      title: 'Rascunhos',
      value: stats.draftProperties,
      icon: FileText,
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-500/10 to-orange-500/5',
    },
    {
      title: 'Total de Leads',
      value: stats.totalLeads,
      icon: Users,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/5',
    },
    {
      title: 'Leads Novos',
      value: stats.newLeads,
      icon: MessageSquare,
      gradient: 'from-rose-500 to-pink-500',
      bgGradient: 'from-rose-500/10 to-pink-500/5',
    },
    {
      title: 'Categorias',
      value: stats.totalCategories,
      icon: TrendingUp,
      gradient: 'from-cyan-500 to-teal-500',
      bgGradient: 'from-cyan-500/10 to-teal-500/5',
    },
  ];

  const quickActions = [
    {
      title: 'Novo Imóvel',
      description: 'Cadastrar um novo imóvel no sistema',
      icon: Building2,
      href: '/admin/imoveis/novo',
      gradient: 'from-blue-500 to-purple-600',
    },
    {
      title: 'Gerenciar Categorias',
      description: 'Adicionar ou editar categorias',
      icon: TrendingUp,
      href: '/admin/categorias',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Ver Leads',
      description: 'Acompanhar contatos recebidos',
      icon: MessageSquare,
      href: '/admin/leads',
      gradient: 'from-amber-500 to-orange-500',
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-xl p-3 shadow-xl">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'leads' ? 'Leads' : 'Imóveis'}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PeriodFilter = () => (
    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-xl">
      {periodOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => setSelectedPeriod(option.value)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200',
            selectedPeriod === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const ExportButton = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={exportToCSV} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Exportar CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Exportar PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao painel de controle
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton />
          <Link
            to="/admin/imoveis/novo"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            <Plus className="h-4 w-4" />
            Novo Imóvel
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className={`admin-stat-card bg-gradient-to-br ${card.bgGradient} border border-border/50`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                <p className="font-display text-4xl font-bold text-foreground">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Leads Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl border border-border/50 bg-card p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Evolução de Leads
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Últimos {selectedPeriod} dias</p>
            </div>
            <PeriodFilter />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  interval={selectedPeriod === 7 ? 0 : selectedPeriod === 30 ? 4 : 10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="leads" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorLeads)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Properties Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl border border-border/50 bg-card p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-foreground">
                Cadastro de Imóveis
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Últimos {selectedPeriod} dias</p>
            </div>
            <PeriodFilter />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorImoveis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  interval={selectedPeriod === 7 ? 0 : selectedPeriod === 30 ? 4 : 10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="imoveis" 
                  fill="url(#colorImoveis)" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={selectedPeriod === 7 ? 60 : selectedPeriod === 30 ? 30 : 15}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Combined Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="rounded-2xl border border-border/50 bg-card p-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">
              Visão Geral
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Comparativo de leads e imóveis</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-sm text-muted-foreground">Leads</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-muted-foreground">Imóveis</span>
            </div>
            <div className="hidden sm:block">
              <PeriodFilter />
            </div>
          </div>
        </div>
        <div className="sm:hidden mb-4">
          <PeriodFilter />
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLeads2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorImoveis2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                interval={selectedPeriod === 7 ? 0 : selectedPeriod === 30 ? 4 : 10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="leads" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorLeads2)" 
              />
              <Area 
                type="monotone" 
                dataKey="imoveis" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorImoveis2)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Ações Rápidas
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <Link
                to={action.href}
                className="admin-quick-action block bg-card group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{action.title}</h3>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
