import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProductReviews({ productId }) {
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, reviewer_name: "", body: "", title: "" });
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const { data: reviews = [] } = useQuery({ queryKey: ["reviews", productId], queryFn: () => base44.entities.Review.filter({ product_id: productId }, "-created_date", 20) });
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "0";

  const handleSubmit = async (e) => {
    e.preventDefault(); setSubmitting(true);
    await base44.entities.Review.create({ ...newReview, product_id: productId, verified_purchase: false });
    queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    toast.success("Thank you for your review!");
    setNewReview({ rating: 5, reviewer_name: "", body: "", title: "" });
    setShowForm(false); setSubmitting(false);
  };

  return (
    <div className="pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-display text-2xl">Reviews</h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(avgRating) ? "fill-accent text-accent" : "text-border"}`} />)}</div>
              <span className="text-sm text-muted-foreground">{avgRating} ({reviews.length})</span>
            </div>
          )}
        </div>
        <button onClick={() => setShowForm(!showForm)} className="text-sm uppercase tracking-editorial border border-border px-4 py-2 rounded-sm hover:bg-secondary transition-colors">Write a Review</button>
      </div>
      {showForm && (
        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} onSubmit={handleSubmit} className="mb-10 p-6 bg-secondary/30 rounded-sm space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Rating</label>
            <div className="flex gap-1">{[1,2,3,4,5].map(s => <button key={s} type="button" onClick={() => setNewReview({...newReview, rating: s})}><Star className={`w-6 h-6 ${s <= newReview.rating ? "fill-accent text-accent" : "text-border"}`} /></button>)}</div>
          </div>
          <input value={newReview.reviewer_name} onChange={(e) => setNewReview({...newReview, reviewer_name: e.target.value})} placeholder="Your name" className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" required />
          <input value={newReview.title} onChange={(e) => setNewReview({...newReview, title: e.target.value})} placeholder="Review title (optional)" className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
          <textarea value={newReview.body} onChange={(e) => setNewReview({...newReview, body: e.target.value})} placeholder="Share your experience..." rows={4} className="w-full bg-background border border-border rounded-sm px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" required />
          <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-foreground text-background text-sm uppercase tracking-editorial rounded-sm hover:bg-foreground/90 transition-colors">{submitting ? "Submitting..." : "Submit Review"}</button>
        </motion.form>
      )}
      {reviews.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-border last:border-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3 h-3 ${s <= review.rating ? "fill-accent text-accent" : "text-border"}`} />)}</div>
                {review.verified_purchase && <span className="text-[10px] uppercase tracking-ultra-wide text-primary">Verified</span>}
              </div>
              {review.title && <h4 className="text-sm font-medium mb-1">{review.title}</h4>}
              <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
              <p className="text-xs text-muted-foreground mt-2">{review.reviewer_name} · {new Date(review.created_date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
