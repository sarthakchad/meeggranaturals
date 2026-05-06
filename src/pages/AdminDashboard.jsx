import { useState, useEffect } from "react";
import { Package, ShoppingCart, MessageSquare, Settings, Lock, LogOut } from "lucide-react";
import ProductsTab from "./admin/ProductsTab";
import OrdersTab from "./admin/OrdersTab";
import MessagesTab from "./admin/MessagesTab";
import SettingsTab from "./admin/SettingsTab";

const TABS = [
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "messages", label: "Messages", icon: MessageSquare },
  { id: "settings", label: "Settings", icon: Settings }
];

const ADMIN_PASSWORD = "admin"; // Default password

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("adminAuth") === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
    setPasswordInput("");
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-20 pb-20 min-h-screen bg-secondary/10 flex flex-col items-center justify-center p-4">
        <div className="bg-background border border-border p-8 rounded-sm shadow-sm max-w-sm w-full animate-in fade-in zoom-in-95 duration-300">
          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-foreground" />
          </div>
          <h1 className="text-2xl font-display font-light text-center mb-6">Admin Access</h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <input
                type="password"
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary bg-background"
                autoFocus
              />
              {error && <p className="text-destructive text-xs mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-foreground text-background text-sm uppercase tracking-editorial hover:bg-foreground/90 transition-colors rounded-sm"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-20 min-h-screen bg-secondary/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row gap-8 mt-8">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-background border border-border rounded-sm p-4 sticky top-28">
            <p className="text-[10px] uppercase tracking-ultra-wide text-muted-foreground mb-4 px-3">
              Admin Menu
            </p>
            <nav className="flex flex-col gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors text-left ${
                      isActive 
                        ? "bg-foreground text-background" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors text-left text-destructive hover:bg-destructive/10 mt-4 border-t border-border pt-4"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-background border border-border rounded-sm p-6 lg:p-10 shadow-sm min-h-[600px]">
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "messages" && <MessagesTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
