import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
// import FloorsPage from "./pages/FloorsPage.tsx";
import CabinetsPage from "./pages/CabinetsPage.tsx";
import ProjectsPage from "./pages/ProjectsPage.tsx";
import ProcessPage from "./pages/ProcessPage.tsx";
import ShowroomPage from "./pages/ShowroomPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage from "./pages/DashboardPage.tsx";
import ProtectedRoute from "./components/auth/ProtectedRoute.tsx";
import ProductsAdminRoute from "./components/auth/ProductsAdminRoute.tsx";
import ProductsLoginPage from "./pages/ProductsLoginPage.tsx";
import ProductsManagerPage from "./pages/ProductsManagerPage.tsx";
import ProductsNewPage from "./pages/ProductsNewPage.tsx";
import ProductsEditPage from "./pages/ProductsEditPage.tsx";
import ProductsPage from "./pages/ProductsPage.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/products" element={<ProductsPage />} />
          {/* <Route path="/floors" element={<FloorsPage />} /> */}
          <Route path="/cabinets" element={<CabinetsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/showroom" element={<ShowroomPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/products-admin/login" element={<ProductsLoginPage />} />
          <Route path="/products-admin" element={<ProductsAdminRoute><ProductsManagerPage /></ProductsAdminRoute>} />
          <Route path="/products-admin/new" element={<ProductsAdminRoute><ProductsNewPage /></ProductsAdminRoute>} />
          <Route path="/products-admin/edit/:id" element={<ProductsAdminRoute><ProductsEditPage /></ProductsAdminRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
