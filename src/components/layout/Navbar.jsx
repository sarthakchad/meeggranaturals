import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Navbar({ onCartOpen, onSearchOpen }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const { data: cartItems = [] } = useQuery({ queryKey: ["cartItems"], queryFn: () => base44.entities.CartItem.list() });
  const { data: wishlistItems = [] } = useQuery({ queryKey: ["wishlistItems"], queryFn: () => base44.entities.WishlistItem.list() });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => { setMobileOpen(false); }, [location]);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const navLinks = [
    { label: "Shop", path: "/shop" }, { label: "Skincare", path: "/shop?category=skincare" },
    { label: "Haircare", path: "/shop?category=haircare" }, { label: "About", path: "/about" }, { label: "Contact", path: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/"><h1 className="font-display text-2xl lg:text-3xl font-light tracking-editorial text-foreground">MEEGRA NATURALS</h1></Link>
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} className="text-sm tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-300 uppercase font-light">{link.label}</Link>
              ))}
            </div>
            <div className="flex items-center gap-3 lg:gap-4">
              <button onClick={onSearchOpen} className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Search className="w-5 h-5" strokeWidth={1.5} /></button>
              <Link to="/wishlist" className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
                <Heart className="w-5 h-5" strokeWidth={1.5} />
                {wishlistItems.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">{wishlistItems.length}</span>}
              </Link>
              <button onClick={onCartOpen} className="p-2 text-muted-foreground hover:text-foreground transition-colors relative">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {cartCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">{cartCount}</span>}
              </button>
              <button onClick={() => setMobileOpen(true)} className="p-2 text-muted-foreground hover:text-foreground transition-colors lg:hidden"><Menu className="w-5 h-5" strokeWidth={1.5} /></button>
            </div>
          </div>
        </div>
      </nav>
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background shadow-2xl animate-slide-in-right">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <span className="font-display text-xl tracking-editorial">MENU</span>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" strokeWidth={1.5} /></button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              {navLinks.map((link) => <Link key={link.path} to={link.path} className="text-lg font-display tracking-wide text-foreground hover:text-primary transition-colors">{link.label}</Link>)}
              <Link to="/admin" className="text-lg font-display tracking-wide text-muted-foreground hover:text-primary transition-colors">Admin</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
