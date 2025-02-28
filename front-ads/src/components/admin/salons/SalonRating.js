import { Star } from 'lucide-react';

export const SalonRating = ({ rating, reviewCount }) => {
  return (
    <div className="flex items-center">
      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
      <span>{rating > 0 ? rating : '평가없음'}</span>
      {reviewCount > 0 && (
        <span className="ml-1 text-xs">({reviewCount})</span>
      )}
    </div>
  );
};