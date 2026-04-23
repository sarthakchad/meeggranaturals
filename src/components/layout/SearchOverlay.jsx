import { useState } from "react";
import { X, Search, ArrowRight } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (value) => {
    setQuery(value);
    if (value.length < 2) { setResults([]); return; }
    setLoading(true);
    const products = await base44.entities.Product.filter({ name: { $regex: value, $options: "i" } }, "-is_bestseller", 8);
    setResults(products);
    setLoading(false);
  };

  const goToProduct = (product) => {
    onClose(); setQuery(""); setResults([]);
    navigate(`/product/${product.id}`);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[80]">
      <div className="absolute inset-0 bg-foreground/30 backdrop-blur-md" onClick={onClose} />
      <div className="relative max-w-2xl mx-auto mt-24 px-6">
        <div className="bg-background rounded-lg shadow-2xl overflow-hidden">
          <div className="flex items-center gap-4 p-6 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
            <input autoFocus type="text" value={query} onChange={(e) => handleSearch(e.target.value)} placeholder="Search products..." className="flex-1 bg-transparent text-lg font-light focus:outline-none placeholder:text-muted-foreground/50" />
            <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground"><X className="w-5 h-5" strokeWidth={1.5} /></button>
          </div>
          {results.length > 0 && (
            <div className="max-h-80 overflow-y-auto p-4">
              {results.map((product) => (
                <button key={product.id} onClick={() => goToProduct(product)} className="w-full flex items-center gap-4 p-3 rounded-sm hover:bg-secondary/50 transition-colors text-left">
                  {product.image_url && <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-sm" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{product.category}</p>
                  </div>
                  <span className="text-sm">₹{product.price?.toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
          {query.length >= 2 && results.length === 0 && !loading && <div className="p-8 text-center"><p className="text-muted-foreground">No products found</p></div>}
          {loading && <div className="p-8 text-center"><div className="w-5 h-5 border-2 border-border border-t-foreground rounded-full animate-spin mx-auto" /></div>}
        </div>
      </div>
    </div>
  );
}
