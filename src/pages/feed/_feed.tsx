import { useState, memo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { OptometristsFeedProps } from "@/types/domain/feed";
import SkeletonCard from "./_skeletonCard";
import LoginModal from "./_loginModal";
import ProfileCard from "./_profileCard";
import { useRouter } from "next/router";

const OptometristsFeed = ({
  optometrists = [],
  isLoading,
  isError,
  error
}: OptometristsFeedProps) => {
  const currentUser = useAuth().user;
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setSelectedUserId] = useState<string | null>(null);

  const handleViewProfile = useCallback((userId: string) => {
    if (!currentUser) {
      setSelectedUserId(userId);
      setIsModalOpen(true);
    } else {
      // Use URL query parameter for persistent navigation
      router.push(`/profile/doc?userId=${userId}`);
    }
  }, [currentUser, router]);

  const handleLogin = useCallback(() => {
    window.location.href = '/account/login';
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  }, []);

  const handleRetry = useCallback(() => {
    window.location.reload();
  }, []);

  if (isLoading) {
    return (
      <div className="max-width mx-auto">
        <div className="flex justify-between items-center mb-6 py-6">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="px-6 py-8">
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600/80 transition-colors"
            type="button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-width mx-auto px-6">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-6 py-6">
          <h1 className="text-2xl font-bold">Optometrists near you</h1>
          <p className="text-gray-600">
            {optometrists.length} {optometrists.length === 1 ? 'optometrist' : 'optometrists'} found
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {optometrists
            .filter(opt => opt && opt.user) // only keep objects with a user
            .map(opt => (
              <ProfileCard
                key={opt.user.id}
                optometrist={opt}
                onViewProfile={handleViewProfile}
              />
            ))}

        </div>

        {optometrists.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <p className="text-gray-500 mb-4">No optometrists found matching your criteria.</p>
              <p className="text-sm text-gray-400">Try adjusting your filters or search terms.</p>
            </div>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onLogin={handleLogin}
      />
    </>
  );
};

export default memo(OptometristsFeed);