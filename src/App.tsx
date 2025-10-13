import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Stays from "./pages/Stays";
import Experiences from "./pages/Experiences";
import Transport from "./pages/Transport";
import Packages from "./pages/Packages";
import Events from "./pages/Events";
import StayDetail from "./pages/StayDetail";
import ExperienceDetail from "./pages/ExperienceDetail";
import TransportDetail from "./pages/TransportDetail";
import PackageDetail from "./pages/PackageDetail";
import EventDetail from "./pages/EventDetail";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/Profile";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import CookieConsent from "./components/CookieConsent";
import AdminLayout from "./admin/layouts/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import InventoryList from "@/admin/pages/inventory/InventoryList";
import InventoryCreate from "@/admin/pages/inventory/InventoryCreate";
import InventoryEdit from "@/admin/pages/inventory/InventoryEdit";
import BookingsList from "@/admin/pages/bookings/BookingsList";
import BookingDetail from "@/admin/pages/bookings/BookingDetail";
import UsersList from "@/admin/pages/users/UsersList";
import UserDetail from "@/admin/pages/users/UserDetail";
import PartnersList from "@/admin/pages/partners/PartnersList";
import PartnerDetail from "@/admin/pages/partners/PartnerDetail";
import Reports from "./admin/pages/Reports";
import Settings from "./admin/pages/Settings";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import HowItWorks from "./pages/HowItWorks";
import BlogList from "./admin/pages/blog/BlogList";
import BlogCreate from "./admin/pages/blog/BlogCreate";
import BlogEdit from "./admin/pages/blog/BlogEdit";
import BlogSettings from "./admin/pages/blog/BlogSettings";
import MediaLibrary from "./admin/pages/media/MediaLibrary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/stays" element={<Stays />} />
            <Route path="/stays/:id" element={<StayDetail />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/experiences/:id" element={<ExperienceDetail />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/transport/:id" element={<TransportDetail />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/packages/:id" element={<PackageDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            
            {/* Blog Pages */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        
        {/* Static Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
            
            {/* Legal Pages */}
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookies" element={<Cookies />} />
            
            {/* Auth Routes */}
            <Route path="/auth/sign-in" element={<SignIn />} />
            <Route path="/auth/sign-up" element={<SignUp />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            
            {/* Protected Routes */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="inventory" element={<InventoryList />} />
              <Route path="inventory/create/:type" element={<InventoryCreate />} />
              <Route path="inventory/edit/:type/:id" element={<InventoryEdit />} />
              <Route path="bookings" element={<BookingsList />} />
              <Route path="bookings/:id" element={<BookingDetail />} />
              <Route path="users" element={<UsersList />} />
              <Route path="users/:id" element={<UserDetail />} />
              <Route path="partners" element={<PartnersList />} />
              <Route path="partners/:id" element={<PartnerDetail />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/create" element={<BlogCreate />} />
              <Route path="blog/edit/:id" element={<BlogEdit />} />
              <Route path="blog/settings" element={<BlogSettings />} />
              <Route path="media" element={<MediaLibrary />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Error Routes */}
            <Route path="/unauthorized" element={<Unauthorized />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
