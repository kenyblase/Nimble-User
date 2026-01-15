interface RatingBreakdownProps {
  ratings: { stars: number; count: number; percentage: number }[];
}

const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ ratings }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="space-y-3">
        {ratings.map((rating) => (
          <div key={rating.stars} className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: rating.stars }, (_, index) => (
                <span key={index} className="text-yellow-400 text-sm">★</span>
              ))}
              {Array.from({ length: 5 - rating.stars }, (_, index) => (
                <span key={index} className="text-gray-300 text-sm">★</span>
              ))}
            </div>
            
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${rating.percentage}%` }}
              />
            </div>
            
            <span className="text-sm text-gray-600 w-8 text-right">
              {rating.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default RatingBreakdown;