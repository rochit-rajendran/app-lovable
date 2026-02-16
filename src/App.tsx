import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { UserPreferencesProvider } from "@/contexts/UserPreferencesContext";
import Dashboard from "./pages/Dashboard";
import BondDiscovery from "./pages/BondDiscovery";
import BondDetailPage from "./pages/BondDetailPage";
import IssuerPage from "./pages/IssuerPage";
import FrameworkDetailPage from "./pages/FrameworkDetailPage";
import WatchlistsPage from "./pages/WatchlistsPage";
import WatchlistDetailPage from "./pages/WatchlistDetailPage";
import PortfoliosPage from "./pages/PortfoliosPage";
import PortfolioDetailPage from "./pages/PortfolioDetailPage";
import ComparisonPage from "./pages/ComparisonPage";
import SavedComparisonsPage from "./pages/SavedComparisonsPage";
import PortfolioReport from "./pages/reports/PortfolioReport";
import ComparisonReport from "./pages/reports/ComparisonReport";
import IssuerReport from "./pages/reports/IssuerReport";
import SettingsPage from "./pages/SettingsPage";
import IntegrationsOverviewPage from "./pages/integrations/IntegrationsOverviewPage";
import ApiKeysPage from "./pages/integrations/ApiKeysPage";
import ApiCatalogPage from "./pages/integrations/ApiCatalogPage";
import PowerBIPage from "./pages/integrations/PowerBIPage";
import ExcelPage from "./pages/integrations/ExcelPage";
import UsageLimitsPage from "./pages/integrations/UsageLimitsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserPreferencesProvider>
        <PortfolioProvider>
          <ComparisonProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/bonds" element={<BondDiscovery />} />
                <Route path="/bonds/:id" element={<BondDetailPage />} />
                <Route path="/issuers/:name" element={<IssuerPage />} />
                <Route path="/frameworks/:id" element={<FrameworkDetailPage />} />
                <Route path="/watchlists" element={<WatchlistsPage />} />
                <Route path="/watchlists/:id" element={<WatchlistDetailPage />} />
                <Route path="/portfolios" element={<PortfoliosPage />} />
                <Route path="/portfolios/:id" element={<PortfolioDetailPage />} />
                <Route path="/comparisons" element={<SavedComparisonsPage />} />
                <Route path="/comparisons/view" element={<ComparisonPage />} />
                {/* Report routes (print-optimized, no AppLayout) */}
                <Route path="/reports/portfolio" element={<PortfolioReport />} />
                <Route path="/reports/comparison" element={<ComparisonReport />} />
                <Route path="/reports/issuer" element={<IssuerReport />} />
                {/* Placeholder routes for navigation */}
                <Route path="/analytics" element={<Dashboard />} />
                <Route path="/green-bonds" element={<BondDiscovery />} />
                <Route path="/esg" element={<Dashboard />} />
                <Route path="/climate-risk" element={<Dashboard />} />
                <Route path="/reports" element={<Dashboard />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/help" element={<Dashboard />} />
                {/* Integrations Hub */}
                <Route path="/integrations" element={<IntegrationsOverviewPage />} />
                <Route path="/integrations/api-keys" element={<ApiKeysPage />} />
                <Route path="/integrations/catalog" element={<ApiCatalogPage />} />
                <Route path="/integrations/power-bi" element={<PowerBIPage />} />
                <Route path="/integrations/excel" element={<ExcelPage />} />
                <Route path="/integrations/usage" element={<UsageLimitsPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ComparisonProvider>
        </PortfolioProvider>
      </UserPreferencesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
