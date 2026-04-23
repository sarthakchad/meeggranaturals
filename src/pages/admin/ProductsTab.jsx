import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Upload, Loader2, Pencil, X, Package, Search, Check, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { optimizeImage } from "@/utils/imageOptimizer";

const EMPTY_FORM = { 
  name: "", category: "skincare", price: "", original_price: "", 
  short_description: "", long_description: "", how_to_use: "", ingredients: "", size: "", gender: "all",
  image_url: "", gallery_urls: [], combo_product_ids: [], 
  skin_types: [], hair_types: [], concerns: [], 
  rating: 5, reviews_count: 0,
  is_bestseller: false, is_new: false, stock_status: "in_stock" 
};

const SKIN_TYPES = ["all", "oily", "dry", "combination", "normal", "sensitive"];
const HAIR_TYPES = ["all", "straight", "wavy", "curly", "coily", "color-treated"];
const CONCERNS = ["acne", "dryness", "hair_fall", "dark_spots", "dandruff", "frizz", "sensitivity", "aging"];

export default function ProductsTab() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("products");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [saving, setSaving] = useState(false);
  const [comboSearch, setComboSearch] = useState("");

  const { data: products = [], isLoading } = useQuery({ queryKey: ["products"], queryFn: () => base44.entities.Product.list("-created_date", 200) });
  const singleProducts = products.filter(p => p.category !== "combo");
  const combos = products.filter(p => p.category === "combo");
  const filteredForCombo = singleProducts.filter(p => p.name.toLowerCase().includes(comboSearch.toLowerCase()));

  const toggleArrayItem = (field, item) => {
    setForm(f => {
      const arr = f[field] || [];
      return { ...f, [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item] };
    });
  };

  const handleImageUpload = async (e, isGallery = false) => {
    const file = e.target.files[0]; if (!file) return;
    
    if (isGallery) setUploadingGallery(true);
    else setUploadingMain(true);
    
    try {
      const optimized = await optimizeImage(file);
      const { file_url } = await base44.integrations.Core.UploadFile({ file: optimized });
      
      if (isGallery) {
        setForm(f => ({ ...f, gallery_urls: [...(f.gallery_urls || []), file_url] }));
        toast.success("Gallery image added!");
      } else {
        setForm(f => ({ ...f, image_url: file_url })); 
        toast.success("Main image uploaded!");
      }
    } catch(err) { 
      toast.error("Upload failed."); 
    } finally { 
      setUploadingMain(false);
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (index) => {
    setForm(f => {
      const newGallery = [...f.gallery_urls];
      newGallery.splice(index, 1);
      return { ...f, gallery_urls: newGallery };
    });
  };

  const openAdd = (isCombo = false) => { setForm({ ...EMPTY_FORM, category: isCombo ? "combo" : "skincare" }); setEditingId(null); setComboSearch(""); setShowForm(true); };
  
  const openEdit = (product) => {
    setForm({ ...EMPTY_FORM, ...product });
    setEditingId(product.id); setComboSearch(""); setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      const data = { 
        ...form, 
        price: parseFloat(form.price) || 0, 
        original_price: form.original_price ? parseFloat(form.original_price) : undefined,
        rating: parseFloat(form.rating) || 5,
        reviews_count: parseInt(form.reviews_count) || 0,
      };
      
      if (editingId) { await base44.entities.Product.update(editingId, data); toast.success("Product updated!"); }
      else { await base44.entities.Product.create(data); toast.success("Product added!"); }
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      setShowForm(false);
    } catch(err) { toast.error("Failed to save."); } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    await base44.entities.Product.delete(id);
    queryClient.invalidateQueries({ queryKey: ["products"] });
    toast.success("Product deleted");
  };

  const isComboForm = form.category === "combo";

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="font-display text-3xl font-light">Product Management</h1></div>
        <button onClick={() => openAdd(tab === "combo")} className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-sm uppercase tracking-editorial hover:bg-foreground/90 transition-colors rounded-sm"><Plus className="w-4 h-4" />{tab === "combo" ? "Add Combo" : "Add Product"}</button>
      </div>
      
      <div className="flex gap-1 mb-8 border-b border-border">
        {[{id:"products",label:`Products (${singleProducts.length})`},{id:"combo",label:`Combos (${combos.length})`}].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-5 py-2.5 text-sm uppercase tracking-editorial border-b-2 transition-colors -mb-px ${tab === t.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{t.label}</button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(8)].map((_,i) => <div key={i} className="animate-pulse"><div className="aspect-[3/4] bg-secondary rounded-sm" /><div className="mt-3 h-4 bg-secondary rounded w-3/4" /></div>)}</div>
      ) : (
        <>
          {tab === "products" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {singleProducts.length === 0 ? <div className="col-span-4 text-center py-20"><Package className="w-12 h-12 text-border mx-auto mb-4" strokeWidth={1} /><p className="text-muted-foreground text-sm mb-4">No products yet.</p><button onClick={() => openAdd()} className="px-6 py-2.5 bg-foreground text-background text-sm uppercase tracking-editorial rounded-sm">Add First Product</button></div>
              : singleProducts.map(p => (
                <div key={p.id} className="group relative border border-border rounded-sm overflow-hidden bg-card">
                  <div className="aspect-square overflow-hidden bg-secondary/30 relative">
                    {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm"><ImageIcon className="w-8 h-8 opacity-20"/></div>}
                    <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(p)} className="w-8 h-8 bg-background rounded-full flex items-center justify-center shadow hover:bg-secondary transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="w-8 h-8 bg-background text-destructive rounded-full flex items-center justify-center shadow hover:bg-destructive hover:text-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="p-3"><p className="text-sm font-medium truncate">{p.name}</p><p className="text-xs text-muted-foreground capitalize mt-1">{p.category} · ₹{p.price}</p></div>
                </div>
              ))}
            </div>
          )}
          {tab === "combo" && (
            combos.length === 0 ? <div className="col-span-4 text-center py-20"><Package className="w-12 h-12 text-border mx-auto mb-4" strokeWidth={1} /><p className="text-muted-foreground text-sm mb-4">No combos yet.</p><button onClick={() => openAdd(true)} className="px-6 py-2.5 bg-foreground text-background text-sm uppercase tracking-editorial rounded-sm">Create First Combo</button></div>
            : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {combos.map(combo => {
                const included = (combo.combo_product_ids || []).map(id => products.find(p => p.id === id)).filter(Boolean);
                return (
                  <div key={combo.id} className="group border border-border rounded-sm p-5 relative bg-card">
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(combo)} className="w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center hover:bg-secondary transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(combo.id)} className="w-8 h-8 bg-background border border-border text-destructive rounded-full flex items-center justify-center hover:bg-destructive hover:text-white transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="flex items-start gap-3 mb-4">
                      {combo.image_url ? <img src={combo.image_url} alt={combo.name} className="w-14 h-14 object-cover rounded-sm flex-shrink-0" /> : <div className="w-14 h-14 bg-secondary rounded-sm flex items-center justify-center"><ImageIcon className="w-5 h-5 opacity-20"/></div>}
                      <div><p className="font-medium text-sm">{combo.name}</p><p className="text-xs text-muted-foreground mt-0.5">₹{combo.price}</p></div>
                    </div>
                    <div className="border-t border-border pt-3">
                      <p className="text-[10px] uppercase tracking-ultra-wide text-muted-foreground mb-2">Includes ({included.length} products)</p>
                      <div className="flex flex-wrap gap-1.5">{included.map(p => <span key={p.id} className="px-2 py-1 bg-secondary text-xs rounded-sm truncate max-w-[120px]">{p.name}</span>)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-background w-full max-w-2xl h-full overflow-y-auto animate-slide-in-right shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
              <h2 className="font-display text-xl font-light">{editingId ? "Edit" : "Add"} {isComboForm ? "Combo" : "Product"}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-secondary"><X className="w-5 h-5 text-muted-foreground hover:text-foreground" /></button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 flex-1 flex flex-col gap-8">
              
              {/* Media Section */}
              <section className="space-y-4">
                <h3 className="font-medium text-sm border-b border-border pb-2">Media</h3>
                
                <div>
                  <label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Main Product Photo</label>
                  <div className="flex gap-4 items-start">
                    {form.image_url && <img src={form.image_url} alt="Preview" className="w-24 h-24 object-cover rounded-sm border border-border flex-shrink-0" />}
                    <label className={`flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-border rounded-sm h-24 cursor-pointer hover:border-primary/50 transition-colors ${uploadingMain ? "opacity-60 pointer-events-none" : ""}`}>
                      {uploadingMain ? <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /> : <Upload className="w-5 h-5 text-muted-foreground" />}
                      <span className="text-xs text-muted-foreground">{uploadingMain ? "Uploading..." : "Click to upload main photo"}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, false)} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Gallery Photos ({form.gallery_urls?.length || 0})</label>
                  <div className="flex flex-wrap gap-4 items-start">
                    {form.gallery_urls?.map((url, i) => (
                      <div key={i} className="relative group w-20 h-20">
                        <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover rounded-sm border border-border" />
                        <button type="button" onClick={() => removeGalleryImage(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"><X className="w-3 h-3"/></button>
                      </div>
                    ))}
                    <label className={`flex flex-col items-center justify-center gap-1 border-2 border-dashed border-border rounded-sm w-20 h-20 cursor-pointer hover:border-primary/50 transition-colors ${uploadingGallery ? "opacity-60 pointer-events-none" : ""}`}>
                      {uploadingGallery ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : <Plus className="w-5 h-5 text-muted-foreground" />}
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, true)} />
                    </label>
                  </div>
                </div>
              </section>

              {/* Basic Info Section */}
              <section className="space-y-4">
                <h3 className="font-medium text-sm border-b border-border pb-2">Basic Information</h3>
                
                <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Product Name *</label><input required value={form.name} onChange={(e) => setForm(f => ({...f, name: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background" /></div>
                
                <div className="grid grid-cols-2 gap-4">
                  {!isComboForm && (
                    <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Category *</label>
                      <select value={form.category} onChange={(e) => setForm(f => ({...f, category: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background">
                        <option value="skincare">Skincare</option><option value="haircare">Haircare</option>
                      </select>
                    </div>
                  )}
                  <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Stock Status</label>
                    <select value={form.stock_status} onChange={(e) => setForm(f => ({...f, stock_status: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background">
                      <option value="in_stock">In Stock</option><option value="low_stock">Low Stock</option><option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                {isComboForm && (
                  <div>
                    <label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Select Products for Combo{form.combo_product_ids.length > 0 && <span className="ml-2 text-primary normal-case tracking-normal">({form.combo_product_ids.length} selected)</span>}</label>
                    <div className="relative mb-2"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" placeholder="Search products..." value={comboSearch} onChange={(e) => setComboSearch(e.target.value)} className="w-full border border-border rounded-sm pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background" /></div>
                    <div className="border border-border rounded-sm max-h-52 overflow-y-auto divide-y divide-border">
                      {filteredForCombo.map(p => { const selected = (form.combo_product_ids || []).includes(p.id); return (
                        <button key={p.id} type="button" onClick={() => toggleArrayItem("combo_product_ids", p.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-secondary/50 transition-colors ${selected ? "bg-primary/5" : ""}`}>
                          {p.image_url ? <img src={p.image_url} alt={p.name} className="w-9 h-11 object-cover rounded-sm flex-shrink-0" /> : <div className="w-9 h-11 bg-secondary rounded-sm flex-shrink-0" />}
                          <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.name}</p><p className="text-xs text-muted-foreground capitalize">{p.category} · ₹{p.price}</p></div>
                          <div className={`w-5 h-5 rounded-sm border flex items-center justify-center flex-shrink-0 ${selected ? "bg-primary border-primary" : "border-border"}`}>{selected && <Check className="w-3 h-3 text-white" />}</div>
                        </button>
                      ); })}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Price *</label><input required type="number" step="0.01" value={form.price} onChange={(e) => setForm(f => ({...f, price: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background" placeholder="0.00" /></div>
                  <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Original Price</label><input type="number" step="0.01" value={form.original_price} onChange={(e) => setForm(f => ({...f, original_price: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background" placeholder="0.00" /></div>
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.is_bestseller} onChange={(e) => setForm(f => ({...f, is_bestseller: e.target.checked}))} className="rounded" />Bestseller</label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={form.is_new} onChange={(e) => setForm(f => ({...f, is_new: e.target.checked}))} className="rounded" />New Arrival</label>
                </div>
              </section>

              {/* Descriptions Section */}
              <section className="space-y-4">
                <h3 className="font-medium text-sm border-b border-border pb-2">Descriptions</h3>
                
                <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Short Description *</label><textarea required rows={2} value={form.short_description} onChange={(e) => setForm(f => ({...f, short_description: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background resize-none" placeholder="Brief summary for product card" /></div>
                
                <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Long Description</label><textarea rows={4} value={form.long_description} onChange={(e) => setForm(f => ({...f, long_description: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background" placeholder="Detailed product information..." /></div>
                
                <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">How to Use</label><textarea rows={3} value={form.how_to_use} onChange={(e) => setForm(f => ({...f, how_to_use: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background" placeholder="Step 1: ..." /></div>
                
                <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Ingredients</label><textarea rows={3} value={form.ingredients} onChange={(e) => setForm(f => ({...f, ingredients: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background font-mono-alt text-xs" placeholder="Aqua, Glycerin, etc..." /></div>
              </section>

              {/* Attributes Section */}
              <section className="space-y-4">
                <h3 className="font-medium text-sm border-b border-border pb-2">Attributes & Classifications</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Size / Volume</label><input value={form.size} onChange={(e) => setForm(f => ({...f, size: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background" placeholder="e.g. 50ml, 100g" /></div>
                  <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Target Gender</label>
                    <select value={form.gender} onChange={(e) => setForm(f => ({...f, gender: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background">
                      <option value="all">All / Unisex</option><option value="female">Female</option><option value="male">Male</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Initial Rating (1-5)</label><input type="number" step="0.1" max="5" min="1" value={form.rating} onChange={(e) => setForm(f => ({...f, rating: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background" /></div>
                  <div><label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Review Count</label><input type="number" step="1" min="0" value={form.reviews_count} onChange={(e) => setForm(f => ({...f, reviews_count: e.target.value}))} className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background" /></div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Target Concerns</label>
                  <div className="flex flex-wrap gap-2">
                    {CONCERNS.map(c => (
                      <button type="button" key={c} onClick={() => toggleArrayItem("concerns", c)} className={`px-3 py-1.5 text-xs rounded-full border transition-colors capitalize ${form.concerns?.includes(c) ? "bg-primary/10 border-primary text-primary font-medium" : "bg-transparent border-border text-muted-foreground"}`}>{c.replace("_", " ")}</button>
                    ))}
                  </div>
                </div>

                {(!isComboForm || form.category === "skincare" || form.category === "combo") && (
                  <div>
                    <label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Skin Types</label>
                    <div className="flex flex-wrap gap-2">
                      {SKIN_TYPES.map(c => (
                        <button type="button" key={c} onClick={() => toggleArrayItem("skin_types", c)} className={`px-3 py-1.5 text-xs rounded-full border transition-colors capitalize ${form.skin_types?.includes(c) ? "bg-primary/10 border-primary text-primary font-medium" : "bg-transparent border-border text-muted-foreground"}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                )}

                {(!isComboForm || form.category === "haircare" || form.category === "combo") && (
                  <div>
                    <label className="text-xs uppercase tracking-ultra-wide text-muted-foreground block mb-2">Hair Types</label>
                    <div className="flex flex-wrap gap-2">
                      {HAIR_TYPES.map(c => (
                        <button type="button" key={c} onClick={() => toggleArrayItem("hair_types", c)} className={`px-3 py-1.5 text-xs rounded-full border transition-colors capitalize ${form.hair_types?.includes(c) ? "bg-primary/10 border-primary text-primary font-medium" : "bg-transparent border-border text-muted-foreground"}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              <div className="pt-4 mt-auto sticky bottom-0 bg-background/90 backdrop-blur-md pb-6">
                <button type="submit" disabled={saving || uploadingMain || uploadingGallery} className="w-full py-3.5 bg-foreground text-background text-sm uppercase tracking-editorial hover:bg-foreground/90 transition-colors rounded-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editingId ? "Save Changes" : isComboForm ? "Create Combo" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
