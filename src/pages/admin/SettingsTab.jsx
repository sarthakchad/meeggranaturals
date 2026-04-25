import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Settings, Upload, Loader2, Save, Trash2, RefreshCw, Cloud, CloudUpload, Monitor } from "lucide-react";
import { toast } from "sonner";

export default function SettingsTab() {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data: settings = [], isLoading } = useQuery({ 
    queryKey: ["siteSettings"], 
    queryFn: () => base44.entities.SiteSetting.list() 
  });

  const getSetting = (key) => settings.find(s => s.key === key);
  const catalogSetting = getSetting("catalog_url");

  const handleCatalogUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      if (catalogSetting) {
        await base44.entities.SiteSetting.update(catalogSetting.id, { value: file_url });
      } else {
        await base44.entities.SiteSetting.create({ key: "catalog_url", value: file_url });
      }
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success("Catalog uploaded successfully!");
    } catch(err) {
      toast.error("Failed to upload catalog");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveCatalog = async () => {
    if (!catalogSetting || !confirm("Remove the current catalog?")) return;
    try {
      await base44.entities.SiteSetting.delete(catalogSetting.id);
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success("Catalog removed");
    } catch(err) {
      toast.error("Failed to remove catalog");
    }
  };
  const handleResetProducts = async () => {
    if (!confirm("This will reset all product modifications and restore the default products from the codebase. Orders and messages will be preserved. Proceed?")) return;
    
    try {
      localStorage.removeItem("naturals_Product");
      toast.success("Products reset to defaults! Refreshing...");
      setTimeout(() => window.location.reload(), 1500);
    } catch (err) {
      toast.error("Failed to reset products");
    }
  };
  const handleToggleCloud = (enable) => {
    if (enable && !confirm("Switch to Cloud Database? Ensure you have migrated your data first if you want to keep your current products.")) return;
    base44.migration.toggleCloud(enable);
  };

  const handleMigrateToCloud = async () => {
    if (!base44.isCloud) {
      toast.error("Please switch to Cloud Mode first before migrating.");
      return;
    }
    const tid = toast.loading("Migrating data to cloud...");
    try {
      const res = await base44.migration.migrateToCloud();
      if (res.error) throw new Error(res.error);
      toast.success(`Successfully migrated ${res.count} products to cloud!`, { id: tid });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (err) {
      toast.error(err.message || "Migration failed", { id: tid });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4">
        <h1 className="font-display text-3xl font-light mb-8">Store Settings</h1>
        <div className="animate-pulse h-48 bg-secondary/50 rounded-sm w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light">Store Settings</h1>
        <p className="text-sm text-muted-foreground mt-2">Manage your site's global configuration</p>
      </div>

      <div className="max-w-2xl space-y-8">
        {/* Catalog Settings */}
        <div className="border border-border rounded-sm bg-card overflow-hidden">
          <div className="p-5 border-b border-border bg-secondary/20">
            <h3 className="font-medium flex items-center gap-2">
              <Settings className="w-4 h-4 text-muted-foreground" />
              Brand Catalog
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a PDF or Image of your brand catalog. Customers can download this from the home page.
            </p>
          </div>
          
          <div className="p-5 space-y-4">
            {catalogSetting?.value ? (
              <div className="flex items-center justify-between p-4 border border-primary/20 bg-primary/5 rounded-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center text-primary">
                    <Save className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Catalog Uploaded</p>
                    <a href={catalogSetting.value} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
                      View current catalog
                    </a>
                  </div>
                </div>
                <button 
                  onClick={handleRemoveCatalog}
                  className="w-8 h-8 flex items-center justify-center text-destructive hover:bg-destructive/10 rounded-sm transition-colors"
                  title="Remove catalog"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-4 border border-dashed border-border rounded-sm bg-secondary/30 text-center">
                <p className="text-sm text-muted-foreground">No catalog is currently uploaded.</p>
              </div>
            )}

            <label className={`flex justify-center items-center gap-2 w-full py-3 border border-border text-sm uppercase tracking-editorial cursor-pointer hover:border-foreground hover:bg-secondary/30 transition-colors rounded-sm ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Uploading..." : catalogSetting ? "Replace Catalog" : "Upload Catalog"}
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={handleCatalogUpload} />
            </label>
          </div>
        </div>

        {/* Cloud Sync */}
        <div className="border border-border rounded-sm bg-card overflow-hidden">
          <div className="p-5 border-b border-border bg-secondary/20">
            <h3 className="font-medium flex items-center gap-2 text-primary">
              <Cloud className="w-4 h-4" />
              Cloud Database (Firebase)
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Store your data in the cloud to sync across all devices.
            </p>
          </div>
          
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between p-4 border border-border bg-secondary/10 rounded-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${base44.isCloud ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {base44.isCloud ? <Cloud className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium">Database Mode: {base44.isCloud ? "Cloud" : "Local"}</p>
                  <p className="text-xs text-muted-foreground">
                    {base44.isCloud 
                      ? "Connected to Firebase Firestore." 
                      : "Using browser local storage."}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleToggleCloud(!base44.isCloud)}
                className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-all rounded-sm ${
                  base44.isCloud 
                    ? "border border-border hover:bg-secondary" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {base44.isCloud ? "Switch to Local" : "Switch to Cloud"}
              </button>
            </div>

            {base44.isCloud && (
              <div className="p-4 border border-primary/20 bg-primary/5 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Migrate Local Data</p>
                  <p className="text-xs text-muted-foreground">Upload your current local products to the cloud database.</p>
                </div>
                <button 
                  onClick={handleMigrateToCloud}
                  className="px-4 py-2 bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-wider font-semibold transition-all rounded-sm flex items-center gap-2"
                >
                  <CloudUpload className="w-3 h-3" />
                  Migrate Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* System Maintenance */}
        <div className="border border-border rounded-sm bg-card overflow-hidden">
          <div className="p-5 border-b border-border bg-secondary/20">
            <h3 className="font-medium flex items-center gap-2 text-destructive">
              <RefreshCw className="w-4 h-4" />
              System Maintenance
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Actions to help synchronize your local storage with the latest code updates.
            </p>
          </div>
          
          <div className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border bg-secondary/10 rounded-sm">
              <div>
                <p className="text-sm font-medium">Reset Products to Defaults</p>
                <p className="text-xs text-muted-foreground">Restore the original product list and images from the source code.</p>
              </div>
              <button 
                onClick={handleResetProducts}
                className="px-4 py-2 bg-destructive/10 text-destructive hover:bg-destructive text-xs uppercase tracking-wider font-semibold hover:text-white transition-all rounded-sm flex items-center gap-2"
              >
                <Trash2 className="w-3 h-3" />
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
