import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Mail, MailOpen, Reply, CheckCircle2, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export default function MessagesTab() {
  const queryClient = useQueryClient();
  const [updatingId, setUpdatingId] = useState(null);

  const { data: messages = [], isLoading } = useQuery({ 
    queryKey: ["messages"], 
    queryFn: () => base44.entities.ContactMessage.list("-created_date", 200) 
  });

  const handleStatusChange = async (messageId, newStatus) => {
    setUpdatingId(messageId);
    try {
      await base44.entities.ContactMessage.update(messageId, { status: newStatus });
      queryClient.invalidateQueries({ queryKey: ["messages"] });
      toast.success(`Message marked as ${newStatus}`);
    } catch(err) {
      toast.error("Failed to update message status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4">
        <h1 className="font-display text-3xl font-light mb-8">Customer Messages</h1>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse h-32 bg-secondary/50 rounded-sm w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-light">Customer Messages</h1>
        <p className="text-sm text-muted-foreground">{messages.length} total messages</p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-sm">
          <MessageSquare className="w-12 h-12 text-border mx-auto mb-4" strokeWidth={1} />
          <p className="text-muted-foreground text-sm">No messages received yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(msg => {
            const isNew = msg.status === "new" || !msg.status;
            
            return (
              <div key={msg.id} className={`border rounded-sm p-6 transition-colors ${isNew ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-base">{msg.subject || "No Subject"}</h3>
                      {isNew && <span className="px-2 py-0.5 bg-primary text-primary-foreground text-[10px] uppercase tracking-wider rounded-full font-medium">New</span>}
                      {msg.status === "replied" && <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider rounded-full font-medium">Replied</span>}
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">{msg.name}</span> 
                      <span className="text-muted-foreground ml-2">&lt;{msg.email}&gt;</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(msg.created_date || Date.now()).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {isNew && (
                      <button 
                        onClick={() => handleStatusChange(msg.id, "read")}
                        disabled={updatingId === msg.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-border bg-background text-xs uppercase tracking-wider rounded-sm hover:bg-secondary transition-colors"
                      >
                        <MailOpen className="w-3.5 h-3.5" /> Mark Read
                      </button>
                    )}
                    {msg.status !== "replied" && (
                      <button 
                        onClick={() => handleStatusChange(msg.id, "replied")}
                        disabled={updatingId === msg.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-transparent bg-foreground text-background text-xs uppercase tracking-wider rounded-sm hover:bg-foreground/90 transition-colors"
                      >
                        <Reply className="w-3.5 h-3.5" /> Mark Replied
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-secondary/30 p-4 rounded-sm border border-border/50">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
