import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import LogoDark from '../common/UI/LogoDark';
import CataloguePreview from './dropdowns/catalogue-preview';
import ContactPreview from './dropdowns/contact-preview';
import { Bell, MessageSquare, Menu, X, ChevronDown } from 'lucide-react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { useMessagesStore } from '@/store/useMessagesStore';
import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@/api/profile/getUserProfile';
import Image from 'next/image';

const Navbar = () => {
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const catalogueDropdownRef = useRef<HTMLDivElement>(null);
  const contactDropdownRef = useRef<HTMLDivElement>(null);

  const { toggleNotificationVisibility } = useNotificationStore();
  const { toggleMessagesVisibility } = useMessagesStore();

  const [activeRoute, setActiveRoute] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [catalogueOpen, setCatalogueOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [desktopImageError, setDesktopImageError] = useState(false);
  const [mobileImageError, setMobileImageError] = useState(false);

  // Fetch user profile to get profile picture
  const { data: profileData } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("No user ID");
      const response = await getUserProfile(user.id);
      return response.data;
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const profilePhoto = profileData?.profile?.photo;

  // Reset image error states when profile photo changes
  useEffect(() => {
    setDesktopImageError(false);
    setMobileImageError(false);
  }, [profilePhoto]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
      if (catalogueDropdownRef.current && !catalogueDropdownRef.current.contains(event.target as Node)) {
        setCatalogueOpen(false);
      }
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target as Node)) {
        setContactOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = ['Home', 'About Us', 'Become a Partner'];

  const handleNavClick = (item: string) => {
    setActiveRoute(item);
    setMobileMenuOpen(false);
  };

  const getHref = (item: string) => {
    if (item === 'Home') return '/';
    if (item === 'Become a Partner') return '/partner';
    return `/${item.toLowerCase().replace(' ', '-')}`;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleSignOut = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.fullName) return 'U';
    const firstInitial = user?.fullName ?? '';
    return firstInitial.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <nav className={`fixed left-0 right-0 z-40 bg-white transition-all duration-500 ease-in-out top-0 }`}>
        <div className="flex justify-between items-center max-width mx-auto px-6 h-16">
          {/* Left Side - Logo and Hamburger (when authenticated) */}
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 transition-colors duration-300 text-darkgray"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
            <LogoDark width={65} height={20} />
          </div>

          <div className="hidden lg:flex space-x-4 items-center">
            {navItems.map((item) => (
              <Link
                key={item}
                href={getHref(item)}
                onClick={() => handleNavClick(item)}
                className="px-4 py-2 cursor-pointer rounded-md transition-all duration-300 ease-in-out font-normal text-sm text-darkgray hover:text-primary-cyan"
              >
                {item}
              </Link>
            ))}

            <div
              className="relative"
              ref={catalogueDropdownRef}
              onMouseEnter={() => setCatalogueOpen(true)}
              onMouseLeave={() => setCatalogueOpen(false)}
            >
              <button className="px-4 py-2 cursor-pointer rounded-md transition-all duration-300 ease-in-out font-normal text-sm text-darkgray hover:text-primary-cyan flex items-center gap-1">
                Shop Eyewears
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${catalogueOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              <div
                className={`absolute w-2xl left-[60%] -translate-x-1/2 top-full mt-2 transition-all duration-300 transform origin-top ${catalogueOpen
                  ? 'opacity-100 scale-100 visible translate-y-0'
                  : 'opacity-0 scale-95 invisible -translate-y-2'
                  }`}
              >
                <CataloguePreview />
              </div>
            </div>

            <div
              className="relative"
              ref={contactDropdownRef}
              onMouseEnter={() => setContactOpen(true)}
              onMouseLeave={() => setContactOpen(false)}
            >
              <button className="px-4 py-2 cursor-pointer rounded-md transition-all duration-300 ease-in-out font-normal text-sm text-darkgray hover:text-primary-cyan flex items-center gap-1">
                Contact
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${contactOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              <div
                className={`absolute w-2xs left-1/2 md:left-auto md:right-0 md:translate-x-0 -translate-x-1/2 top-full mt-2 transition-all duration-300 transform origin-top ${contactOpen
                  ? 'opacity-100 scale-100 visible translate-y-0'
                  : 'opacity-0 scale-95 invisible -translate-y-2'
                  }`}
              >
                <ContactPreview />
              </div>
            </div>
          </div>

          {/* Desktop Right Side - Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                {/* Message Icon */}
                <button
                  onClick={toggleMessagesVisibility}
                  className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                  aria-label="Messages"
                >
                  <MessageSquare className="w-5 h-5 text-darkgray" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notification Icon */}
                <button
                  onClick={toggleNotificationVisibility}
                  className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-darkgray" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-1 px-[4px] py-[2px] rounded-full border border-gray-300 bg-transparent hover:border-gray-400 hover:shadow-md transition-all duration-300"
                  >
                    {profilePhoto && !desktopImageError ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden relative">
                        <Image
                          src={profilePhoto}
                          alt={user?.fullName || 'User'}
                          width={32}
                          height={32}
                          className="object-cover"
                          onError={() => setDesktopImageError(true)}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-darkgray flex items-center justify-center text-sm font-medium">
                        {getUserInitials()}
                      </div>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  {/* Desktop Dropdown Menu */}
                  <div
                    className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 transition-all duration-300 transform origin-top-right ${dropdownOpen
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible'
                      }`}
                  >
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-darkgray hover:bg-gray-100 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/feed"
                        className="block px-4 py-2 text-sm text-darkgray hover:bg-gray-100 transition-colors"
                      >
                        Feed
                      </Link>
                      <Link
                        href="/contact"
                        className="block px-4 py-2 text-sm text-darkgray hover:bg-gray-100 transition-colors"
                      >
                        Contact Support
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 ">
                <Link
                  href="/account/login"
                  className="px-4 py-2 bg-black/5 hover:shadow-lg transition-all duration-300 ease-in-out rounded-full border-none text-darkgray text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/account/register"
                  className="px-4 py-2 bg-primary-cyan hover:shadow-lg transition-all duration-300 ease-in-out rounded-full border-none text-white text-sm"
                >
                  Join us at Nethra
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Right Side - Auth Icons (when authenticated) */}
          <div className="lg:hidden flex items-center gap-2">
            {user ? (
              <>
                {/* Message Icon */}
                <button
                  onClick={toggleMessagesVisibility}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                  aria-label="Messages"
                >
                  <MessageSquare className="w-5 h-5 text-darkgray" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Notification Icon */}
                <button
                  onClick={toggleNotificationVisibility}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-darkgray" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative" ref={mobileDropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center gap-1 px-[4px] py-[2px] rounded-full border border-gray-300 bg-transparent hover:border-gray-400 hover:shadow-md transition-all duration-300"
                  >
                    {profilePhoto && !mobileImageError ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden relative">
                        <Image
                          src={profilePhoto}
                          alt={user?.fullName || 'User'}
                          width={32}
                          height={32}
                          className="object-cover"
                          onError={() => setMobileImageError(true)}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-darkgray flex items-center justify-center text-sm font-medium">
                        {getUserInitials()}
                      </div>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  {/* Mobile Dropdown Menu */}
                  <div
                    className={`absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 transition-all duration-300 transform origin-top-right ${dropdownOpen
                      ? 'opacity-100 scale-100 visible'
                      : 'opacity-0 scale-95 invisible'
                      }`}
                  >
                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-darkgray hover:bg-gray-100 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        href="/feed"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-darkgray hover:bg-gray-100 transition-colors"
                      >
                        Feed
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-darkgray hover:bg-gray-100 transition-colors"
                      >
                        Contact Support
                      </Link>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <button
                onClick={toggleMobileMenu}
                className="p-2 transition-colors duration-300 text-darkgray"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>


        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[48rem] opacity-100' : 'max-h-0 opacity-0'
            }`}
          ref={mobileMenuRef}
        >

          <div className="pt-4 pb-2 px-2 bg-white rounded-lg mt-4 border-t border-gray-200">
            {user ? (
              <>
                {/* User Info Header */}
                <div className="flex items-center space-x-3 px-4 py-4 border-b border-gray-200">
                  {profilePhoto && !mobileImageError ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden relative flex-shrink-0">
                      <Image
                        src={profilePhoto}
                        alt={user?.fullName || 'User'}
                        width={48}
                        height={48}
                        className="object-cover"
                        onError={() => setMobileImageError(true)}
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 text-darkgray flex items-center justify-center text-lg font-medium">
                      {getUserInitials()}
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-darkgray text-sm">
                      {user?.fullName || 'User'}
                    </div>
                    {user?.email && <div className="text-sm text-darkgray">{user?.email}</div>}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-md transition-all duration-300 font-medium text-sm text-darkgray hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-md transition-all duration-300 font-medium text-sm text-darkgray hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/help"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-md transition-all duration-300 font-medium text-sm text-darkgray hover:bg-gray-100"
                  >
                    Help & Support
                  </Link>
                </div>

                {/* Logout Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-3 rounded-md transition-all duration-300 font-medium text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Navigation Links */}
                {navItems.map((item) => (
                  <Link
                    key={item}
                    href={getHref(item)}
                    onClick={() => handleNavClick(item)}
                    className={`block px-4 py-3 cursor-pointer rounded-md transition-all duration-300 ease-in-out font-medium text-sm ${activeRoute === item
                      ? 'bg-gray-200 text-darkgray'
                      : 'text-darkgray hover:bg-gray-100'
                      }`}
                  >
                    {item}
                  </Link>
                ))}

                {/* Shop Eyewears - Mobile Link Only */}
                <Link
                  href="/shop-eyewears"
                  onClick={() => handleNavClick('Shop Eyewears')}
                  className="block px-4 py-3 rounded-md transition-all duration-300 font-medium text-sm text-darkgray hover:bg-gray-100"
                >
                  Shop Eyewears
                </Link>

                {/* Contact - Mobile Link Only */}
                <Link
                  href="/contact"
                  onClick={() => handleNavClick('Contact')}
                  className="block px-4 py-3 rounded-md transition-all duration-300 font-medium text-sm text-darkgray hover:bg-gray-100"
                >
                  Contact
                </Link>

                {/* Auth Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    href="/account/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center px-4 py-3 rounded-full font-medium text-sm transition-all duration-300 text-darkgray border border-darkgray hover:bg-darkgray hover:text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/account/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center px-4 py-3 rounded-full font-medium text-sm transition-all duration-300 bg-primary-cyan text-white hover:bg-primary-cyan/90"
                  >
                    Join us at Nethra
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;