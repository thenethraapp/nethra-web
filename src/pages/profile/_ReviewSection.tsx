import { Star } from 'lucide-react';

export default function ReviewsSection() {
  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <p className="font-semibold text-gray-700 mb-4">Customer Reviews</p>

      <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
        <p className="font-medium text-blue-600">Sam Ade</p>
        <div className="flex items-center mb-2">
          {[...Array(4)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          ))}
          <Star className="w-4 h-4 text-gray-300" />
        </div>
        <p className="text-sm text-gray-600">
          Lorem ipsum dolor sit amet consectetur. Cras consequat pellentesque hac sit. Felis tempor
          sagittis vitae varius fames lacus.
        </p>
      </div>

      <button className="mt-4 text-sm text-red-500 hover:underline">See all reviews –</button>
    </div>
  );
}
