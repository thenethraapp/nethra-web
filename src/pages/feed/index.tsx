"use client";
import { useMemo, useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Hero from "./_hero";
import OptometristSearch from "./_search";
import OptometristsFeed from "./_feed";
import Pagination from "./_pagination";
import { getAllOptometristsProfile } from "@/api/profile/optometrist/get-all-optometrists-profile";
import ProfileCompletionSticker from "@/component/common/ProfileCompletionSticker";
import { ProfileData } from "@/types/domain/optometrist";

const ITEMS_PER_PAGE = 12;
const SEARCH_DEBOUNCE_MS = 500; // 500ms debounce delay

const HomeFeed = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [specialization, setSpecialization] = useState("all");
  const [location, setLocation] = useState("all");
  const [certificateType, setCertificateType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to page 1 when search changes
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [specialization, location, certificateType]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["optometrists", currentPage, debouncedSearchQuery],
    queryFn: async () => {
      const res = await getAllOptometristsProfile({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearchQuery || undefined,
      });
      if (!res.success) {
        throw new Error(res.message || "Failed to load optometrists");
      }
      return {
        optometrists: res.data || [],
        pagination: res.pagination || {
          page: 1,
          limit: ITEMS_PER_PAGE,
          totalCount: 0,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for search results
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const optometrists = data?.optometrists || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  };

  // Client-side filtering for dropdown filters (specialization, location, certificateType)
  // Note: Search is now handled server-side, but we keep client-side filters for UX
  const filteredOptometrists = useMemo(() => {
    let filtered = optometrists.filter((opt: ProfileData) => opt.profile !== null);

    if (specialization !== "all") {
      filtered = filtered.filter((opt: ProfileData) =>
        opt.profile?.expertise?.includes(specialization)
      );
    }

    if (location !== "all") {
      filtered = filtered.filter((opt: ProfileData) => opt.profile?.location === location);
    }

    if (certificateType !== "all") {
      filtered = filtered.filter((opt: ProfileData) => opt.user?.certificateType === certificateType);
    }

    // Sort by profile completeness: doctors with at least one of location, skills, or bio appear first
    filtered.sort((a: ProfileData, b: ProfileData) => {
      const aHasLocation = !!a.profile?.location;
      const aHasSkills = !!a.profile?.expertise && a.profile.expertise.length > 0;
      const aHasBio = !!a.profile?.about && a.profile.about.trim().length > 0;
      const aHasAnyField = aHasLocation || aHasSkills || aHasBio;

      const bHasLocation = !!b.profile?.location;
      const bHasSkills = !!b.profile?.expertise && b.profile.expertise.length > 0;
      const bHasBio = !!b.profile?.about && b.profile.about.trim().length > 0;
      const bHasAnyField = bHasLocation || bHasSkills || bHasBio;

      // Doctors with at least one field come first
      if (aHasAnyField && !bHasAnyField) return -1;
      if (!aHasAnyField && bHasAnyField) return 1;

      // If both have at least one field or both have none, maintain original order
      return 0;
    });

    return filtered;
  }, [optometrists, specialization, location, certificateType]);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setSpecialization("all");
    setLocation("all");
    setCertificateType("all");
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Scroll to top of feed when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="pb-12">
      <Hero />
      <OptometristSearch
        data={optometrists}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        specialization={specialization}
        setSpecialization={setSpecialization}
        location={location}
        setLocation={setLocation}
        certificateType={certificateType}
        setCertificateType={setCertificateType}
        onClearFilters={handleClearFilters}
        resultCount={pagination.totalCount}
        isSearching={isLoading && !!debouncedSearchQuery}
      />
      <OptometristsFeed
        optometrists={filteredOptometrists}
        isLoading={isLoading}
        isError={isError}
        error={error?.message}
      />
      {!isLoading && !isError && pagination.totalPages > 0 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
      <ProfileCompletionSticker />
    </div>
  );
};

export default HomeFeed;