"use client"
import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Search, MapPin, ChevronDown, Trash2Icon, SlidersHorizontal } from 'lucide-react';
import { DropdownOption, Optometrist } from '@/types/feed/search';

interface OptometristSearchProps {
  data: Optometrist[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  specialization: string;
  setSpecialization: (specialization: string) => void;
  location: string;
  setLocation: (location: string) => void;
  certificateType: string;
  setCertificateType: (certificateType: string) => void;
  onClearFilters: () => void;
  resultCount?: number;
  isSearching?: boolean;
}

const OptometristSearch = ({
  data = [],
  searchQuery,
  setSearchQuery,
  specialization,
  setSpecialization,
  location,
  setLocation,
  certificateType,
  setCertificateType,
  onClearFilters,
  resultCount,
  isSearching = false
}: OptometristSearchProps) => {
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 640);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const expertiseOptions: DropdownOption[] = useMemo(() => {
    const values = new Set<string>();
    data.forEach((opt: Optometrist) => {
      if (opt.profile?.expertise) {
        opt.profile.expertise.forEach((exp: string) => values.add(exp));
      }
    });
    return [
      { value: 'all', label: 'All Specializations' },
      ...Array.from(values).sort().map((exp: string) => ({ value: exp, label: exp }))
    ];
  }, [data]);

  const locationOptions: DropdownOption[] = useMemo(() => {
    const values = new Set<string>();
    data.forEach((opt: Optometrist) => {
      if (opt.profile?.location) {
        values.add(opt.profile.location);
      }
    });
    return [
      { value: 'all', label: 'All Locations' },
      ...Array.from(values).sort().map((loc: string) => ({ value: loc, label: loc }))
    ];
  }, [data]);

  const certificateOptions: DropdownOption[] = useMemo(() => {
    const values = new Set<string>();
    data.forEach((opt: Optometrist) => {
      if (opt.user?.certificateType) {
        values.add(opt.user.certificateType);
      }
    });
    return [
      { value: 'all', label: 'All Certificates' },
      ...Array.from(values).sort().map((cert: string) => ({ value: cert, label: cert }))
    ];
  }, [data]);

  // Memoize callbacks
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, [setSearchQuery]);

  const handleSpecializationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecialization(e.target.value);
  }, [setSpecialization]);

  const handleLocationChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocation(e.target.value);
  }, [setLocation]);

  const handleCertificateChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setCertificateType(e.target.value);
  }, [setCertificateType]);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

  return (
    <section className="relative max-width mx-auto -mt-20 z-10 bg-white shadow-sm rounded-lg p-6">
      <div className="mb-6">
        <div className="relative flex items-center">
          <span className='absolute left-1 bg-primary-cyan h-[80%] px-2.5 text-white rounded-full flex items-center justify-center z-10'>
            <MapPin size={20} />
          </span>
          <input
            type="text"
            placeholder="Search for optometrists, clinics, or services..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none text-gray-700"
          />
          <button
            className="absolute right-1 w-fit bg-primary-cyan hover:bg-primary-cyan/70 cursor-pointer 
            items-center gap-1 h-[80%] px-2.5 md:px-6 rounded-full text-white 
             transition-colors hidden sm:flex"
          >
            <Search size={20} />
            Search
          </button>
        </div>
        {resultCount !== undefined && (
          <p className="text-sm text-gray-600 mt-2">
            {isSearching ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Searching...
              </span>
            ) : (
              <>
                {resultCount} {resultCount === 1 ? 'result' : 'results'} found
              </>
            )}
          </p>
        )}
      </div>

      <div className="flex justify-end sm:hidden">
        <button
          onClick={toggleFilters}
          className="flex items-center gap-2 text-xs font-medium px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          <SlidersHorizontal size={16} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filters */}
      {(showFilters || isDesktop) && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Specialization Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialization
              </label>
              <div className="relative">
                <select
                  value={specialization}
                  onChange={handleSpecializationChange}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none text-gray-700"
                >
                  {expertiseOptions.map((option: DropdownOption) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Location Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="relative">
                <select
                  value={location}
                  onChange={handleLocationChange}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none text-gray-700"
                >
                  {locationOptions.map((option: DropdownOption) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificate Type
              </label>
              <div className="relative">
                <select
                  value={certificateType}
                  onChange={handleCertificateChange}
                  className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-primary-blue focus:border-transparent outline-none text-gray-700"
                >
                  {certificateOptions.map((option: DropdownOption) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex justify-end gap-4">
            <button
              onClick={onClearFilters}
              className="cursor-pointer text-xs flex items-center gap-2 bg-deepnavy/40 hover:bg-deepnavy/30 text-white font-semibold px-6 py-2 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none"
            >
              Clear Filters <Trash2Icon size={15} />
            </button>
          </div>
        </>
      )}
    </section>
  );
};

export default memo(OptometristSearch);