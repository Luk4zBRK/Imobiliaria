import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import HomePage from "./pages/HomePage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import ContactPage from "./pages/ContactPage";
import AdvertisePage from "./pages/AdvertisePage";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminResetPasswordPage from "./pages/admin/AdminResetPasswordPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPropertiesPage from "./pages/admin/AdminPropertiesPage";
import AdminPropertyFormPage from "./pages/admin/AdminPropertyFormPage";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage";
import AdminLeadsPage from "./pages/admin/AdminLeadsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import { AdminLayout } from "@/components/admin/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/imoveis" element={<PropertiesPage />} />
                <Route path="/imovel/:slug" element={<PropertyDetailPage />} />
                <Route path="/categorias" element={<CategoriesPage />} />
                <Route path="/contato" element={<ContactPage />} />
                <Route path="/anuncie" element={<AdvertisePage />} />
                <Route path="/sobre" element={<AboutPage />} />
                <Route path="/buscar" element={<PropertiesPage />} />
              </Route>
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="imoveis" element={<AdminPropertiesPage />} />
                <Route path="imoveis/novo" element={<AdminPropertyFormPage />} />
                <Route path="imoveis/:id/editar" element={<AdminPropertyFormPage />} />
                <Route path="categorias" element={<AdminCategoriesPage />} />
                <Route path="leads" element={<AdminLeadsPage />} />
                <Route path="configuracoes" element={<AdminSettingsPage />} />
                <Route path="usuarios" element={<AdminUsersPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
