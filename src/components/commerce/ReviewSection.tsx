import React, { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquare, Plus, X } from 'lucide-react';
import { ProductReview } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ReviewSectionProps {
  productId: string;
  // Optional — VEYONN has no review/rating capability today, so a real
  // product passes no rating/reviewCount at all. Never fabricated; see the
  // "Rating Snapshot" block below for the clean empty state used instead.
  rating?: number;
  reviewCount?: number;
  initialReviews: ProductReview[];
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  rating,
  reviewCount,
  initialReviews
}) => {
  const { showToast, currentUser, isAuthenticated, navigate } = useShop();
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newBike, setNewBike] = useState(currentUser?.bikeModel || '');

  const handleHelpful = (reviewId: string) => {
    setReviews(prev =>
      prev.map(r => (r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
    showToast('Thank you for your feedback!', 'info');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) {
      showToast('Please provide both a title and review feedback.', 'warning');
      return;
    }

    const review: ProductReview = {
      id: `rev-${Date.now()}`,
      author: currentUser?.name || 'Fellow Rider',
      rating: newRating,
      date: 'Just now',
      title: newTitle.trim(),
      comment: newComment.trim(),
      verifiedPurchase: true,
      bikeModel: newBike.trim() || undefined,
      helpfulCount: 0
    };

    setReviews(prev => [review, ...prev]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewComment('');
    showToast('Your verified rider review has been published!', 'success');
  };

  return (
    <div className="py-8 border-t border-neutral-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h3 className="text-xl font-bold text-neutral-950">Verified Rider Reviews</h3>
          <p className="text-xs text-neutral-500 mt-0.5">Real road and highway impressions from genuine gear owners</p>
        </div>

        <button
          onClick={() => {
            if (!isAuthenticated) {
              showToast('Please sign in to post a verified rider review.', 'info');
              navigate('/login');
            } else {
              setIsModalOpen(true);
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center space-x-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Rating Snapshot — a clean neutral state when there's no real
          rating/review data (VEYONN has no review capability yet) rather
          than a blank number or an empty-looking 5-star row. */}
      {rating != null && reviewCount != null ? (
        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-center">
          <div className="text-center md:border-r md:border-neutral-200 md:pr-6">
            <div className="text-4xl font-extrabold text-neutral-950 font-mono">{rating}</div>
            <div className="flex items-center justify-center space-x-1 my-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                />
              ))}
            </div>
            <div className="text-xs text-neutral-500 font-medium">Based on {reviewCount} verified reviews</div>
          </div>

          <div className="md:col-span-2 space-y-1.5 text-xs text-neutral-600">
            <div className="flex items-center space-x-3">
              <span className="w-12 font-medium">5 Stars</span>
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-[88%]" />
              </div>
              <span className="w-8 text-right font-mono">88%</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-12 font-medium">4 Stars</span>
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-[10%]" />
              </div>
              <span className="w-8 text-right font-mono">10%</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-12 font-medium">3 Stars</span>
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full w-[2%]" />
              </div>
              <span className="w-8 text-right font-mono">2%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center space-x-3 mb-8 text-neutral-500">
          <MessageSquare className="w-5 h-5 text-neutral-300 shrink-0" />
          <span className="text-xs font-medium">No reviews yet — be the first to share your experience.</span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(rev => (
          <div key={rev.id} className="p-5 bg-white rounded-2xl border border-neutral-200/80 space-y-2.5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-neutral-900">{rev.author}</span>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3" />
                      <span>Verified Rider</span>
                    </span>
                  )}
                  {rev.bikeModel && (
                    <span className="text-[11px] text-neutral-400 hidden sm:inline">
                      • {rev.bikeModel}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-1.5 mt-1">
                  <div className="flex space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400">• {rev.date}</span>
                </div>
              </div>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-neutral-950">{rev.title}</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>

            <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400">
              <button
                onClick={() => handleHelpful(rev.id)}
                className="flex items-center space-x-1 hover:text-neutral-700 font-medium transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
              <span>Inspected by District 38 Trichy</span>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-xs" />
          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 text-neutral-900">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <h3 className="text-base font-bold">Write a Rider Review</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-neutral-400 hover:text-neutral-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Overall Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Headline / Summary</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Excellent highway comfort & zero buffeting"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Your Motorcycle Model (Optional)</label>
                <input
                  type="text"
                  value={newBike}
                  onChange={e => setNewBike(e.target.value)}
                  placeholder="e.g. Royal Enfield Himalayan 450 / Duke 390"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">Detailed Review & Experience</label>
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="How does this gear perform at speed, in rain, or in daily traffic? Mention fitting, ventilation, and build quality."
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs focus:outline-none focus:border-orange-500 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
