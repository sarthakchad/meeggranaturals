import { useState } from "react";
import { Package, ShoppingCart, MessageSquare, Settings } from "lucide-react";
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

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
