import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { PackageOpen, Clock, Truck, CheckCircle2, XCircle, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", icon: Clock, color: "text-amber-500 bg-amber-50" },
  { value: "confirmed", label: "Confirmed", icon: PackageOpen, color: "text-blue-500 bg-blue-50" },
  { value: "shipped", label: "Shipped", icon: Truck, color: "text-indigo-500 bg-indigo-50" },
  { value: "delivered", label: "Delivered", icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
  { value: "cancelled", label: "Cancelled", icon: XCircle, color: "text-rose-500 bg-rose-50" }
];

export default function OrdersTab() {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState(null);

  const { data: orders = [], isLoading } = useQuery({ 
    queryKey: ["orders"], 
    queryFn: () => base44.entities.Order.list("-created_date", 200) 
  });

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await base44.entities.Order.update(orderId, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(`Order status updated to ${newStatus}`);
    } catch(err) {
      toast.error("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4">
        <h1 className="font-display text-3xl font-light mb-8">Order Management</h1>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse h-24 bg-secondary/50 rounded-sm w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light">Order Management</h1>
        <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-sm">
          <PackageOpen className="w-12 h-12 text-border mx-auto mb-4" strokeWidth={1} />
          <p className="text-muted-foreground text-sm">No orders received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const currentStatus = STATUS_OPTIONS.find(s => s.value === order.status) || STATUS_OPTIONS[0];
            const StatusIcon = currentStatus.icon;
            
            return (
              <div key={order.id} className="border border-border rounded-sm p-5 bg-card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.created_date || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium mt-1">{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_email} • {order.customer_phone}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total</p>
                      <p className="font-medium">₹{order.total?.toFixed(2)}</p>
                    </div>

                    <div className="relative group">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className={`appearance-none flex items-center gap-2 pl-9 pr-8 py-2 rounded-full text-xs font-medium border border-transparent cursor-pointer hover:border-border transition-colors ${currentStatus.color} ${updatingId === order.id ? 'opacity-50' : ''}`}
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      <StatusIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-3">Order Items</p>
                    <div className="space-y-3">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start text-sm">
                          <div className="flex gap-3">
                            <span className="text-muted-foreground">{item.quantity}x</span>
                            <span>{item.product_name}</span>
                          </div>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-ultra-wide text-muted-foreground mb-3">Shipping Details</p>
                    <p className="text-sm whitespace-pre-line text-muted-foreground leading-relaxed">
                      {order.shipping_address || "No address provided."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
