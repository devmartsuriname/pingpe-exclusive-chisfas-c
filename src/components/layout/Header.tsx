import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Bell, ChevronDown, User, LogOut, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SearchModal } from "@/components/search/SearchModal";
import { useSettings } from "@/admin/hooks/useSettings";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import logo from "@/assets/logo.png";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const prefersReducedMotion = useReducedMotion();
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const { getSetting, updateSetting } = useSettings();
  const { toast } = useToast();

  const currentCurrency = getSetting("currency")?.value?.value || "USD";

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Stays", href: "/stays" },
    { name: "Tours", href: "/experiences" },
    { name: "Accommodation", href: "/accommodation" },
    { name: "Village", href: "/village" },
    { name: "About", href: "/about" },
  ];

  // Scroll detection for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user?.id)
      .single();
    
    if (data) {
      setProfile(data);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCurrencyChange = (currency: string) => {
    updateSetting({
      key: "currency",
      value: { value: currency },
      description: "Default currency for the platform"
    });
    toast({
      title: "Currency updated",
      description: `Currency changed to ${currency}`,
    });
  };

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isScrolled 
          ? "h-16 backdrop-blur-xl bg-background/80 border-b border-border/50 shadow-lg" 
          : "h-20 bg-background border-b border-border"
      )}
      initial={prefersReducedMotion ? { y: 0 } : { y: -100 }}
      animate={{ y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo with Scale Animation */}
          <Link to="/" className="flex items-center group">
            <motion.img 
              src={logo}
              alt="PingPe Jungle Resort"
              className="h-10 md:h-12 w-auto object-contain"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            />
          </Link>

          {/* Desktop Navigation - Center with Enhanced Hover */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="group relative px-4 py-2 text-sm font-medium text-foreground rounded-full transition-all hover:scale-105"
              >
                <span className="relative z-10">{item.name}</span>
                <motion.div 
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions - Right */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-2" 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2" aria-label="Select currency">
                  {currentCurrency}
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Select Currency</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleCurrencyChange("USD")}>
                  USD ($)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCurrencyChange("EUR")}>
                  EUR (€)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCurrencyChange("GBP")}>
                  GBP (£)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCurrencyChange("JPY")}>
                  JPY (¥)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCurrencyChange("AUD")}>
                  AUD (A$)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <ThemeToggle />
            
            {user ? (
              <>
                <Button variant="ghost" size="icon" aria-label="View notifications">
                  <Bell className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open user menu">
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={profile?.avatar_url} />
                        <AvatarFallback>
                          {profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <span className="font-medium">{profile?.full_name || "User"}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {roles.includes("admin") && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin/dashboard" className="cursor-pointer">
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth/sign-up">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Animated Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden border-t backdrop-blur-xl bg-background/95"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="py-4">
                <motion.nav 
                  className="flex flex-col gap-2 mb-4"
                  initial="closed"
                  animate="open"
                  exit="closed"
                  variants={{
                    open: { transition: { staggerChildren: 0.05 } },
                    closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } }
                  }}
                >
                  {navigation.map((item) => (
                    <motion.div
                      key={item.name}
                      variants={{
                        open: { opacity: 1, x: 0 },
                        closed: { opacity: 0, x: -20 }
                      }}
                    >
                      <Link
                        to={item.href}
                        className="block px-4 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </motion.nav>

                {/* Mobile Search Button */}
                <motion.div
                  className="px-4 mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setIsSearchOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Search className="w-4 h-4" />
                    Search PingPe
                  </Button>
                </motion.div>
                
                {user ? (
                  <motion.div 
                    className="flex flex-col gap-2 px-4 pt-4 border-t"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg px-2 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    {roles.includes("admin") && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-2 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg px-2 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 text-sm font-medium text-destructive hover:bg-muted rounded-lg px-2 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    className="flex flex-col gap-2 px-4 pt-4 border-t"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <Link to="/auth/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="w-full">
                      <Link to="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </motion.header>
  );
}
