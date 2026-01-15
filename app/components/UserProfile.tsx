interface UserProfileProps {
  name: string;
  location: string;
  isVerified: boolean;
  rating: number;
  totalRatings: number;
  followersCount?: string;
}



const UserProfile: React.FC<UserProfileProps> = ({
  name,
  location,
  isVerified,
  rating,
  totalRatings,
  followersCount
}) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-semibold">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-gray-900">{name}</h1>
            {isVerified && (
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Verified ID
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3">📍 {location}</p>
          
          <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
            Follow
          </button>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{rating}</div>
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={`text-sm ${
                  index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500">{totalRatings} ratings</p>
        </div>
      </div>
    </div>
  );
};


export default UserProfile;