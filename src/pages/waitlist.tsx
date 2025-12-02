import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { joinWaitList } from '@/api/waitList/waitList';
import { getUserIP } from '@/queries';
import type { WaitlistRole } from '@/api/waitList/waitList';
import { useRouter } from 'next/router';
import LogoDark from '@/component/common/UI/LogoDark';
import Link from 'next/link';

const WaitList = () => {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<WaitlistRole>('patient');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: ipData } = useQuery({
    queryKey: ['userIP', 'waitlist'],
    queryFn: getUserIP,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setIsProcessing(false);
    setIsSubmitted(false);
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const payload = {
      role: selectedRole,
      fullName: formData.fullName || undefined,
      email: formData.email,
      phone: formData.phone || undefined,
      message: formData.message || undefined,
      ipInfo: ipData ? {
        ip: ipData.ip || '',
        city: ipData.city || '',
        region: ipData.region || '',
        country: ipData.country || '',
        loc: ipData.loc || '',
        timezone: ipData.timezone || '',
      } : undefined,
    };

    setIsProcessing(true);
    try {
      const res = await joinWaitList(payload);

      if (res.success) {
        toast.success(res.message);
        setIsSubmitted(true);
        setFormData({ fullName: '', email: '', phone: '', message: '' });
        setTimeout(() => router.replace('/'), 5000);
      } else {
        toast.error(res.message);
      }

    } catch {
      toast.error('An error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen -mt-[60px] bg-gradient-to-b from-primary-cyan/20 via-white to-primary-white px-6">
      {/* Navbar */}
      <div className="px-6 py-3 max-w-4xl mx-auto flex items-center justify-between">
        <LogoDark width={100} />
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-600 hover:text-primary-cyan transition-colors">Home</Link>
          <span className="text-gray-400">|</span>
          <Link href="/about-us" className="text-gray-600 hover:text-primary-cyan transition-colors">About Us</Link>
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 py-12 w-full max-w-4xl mx-auto text-center">
        <div className="text-primary-cyan/90 px-3 py-1 text-[11px] bg-white/70 font-medium rounded-full shadow-sm mx-auto w-fit border border-white">
          Launching Dec 22, 2025
        </div>
        <h1 className="text-3xl md:text-5xl font-semibold text-darkgray/90 mt-6 leading-tight">
          Join the Revolution in <span className="text-primary-blue">AI-Powered Eye Health</span>
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mt-3">
          Be among the first to experience our platform. We’ll notify you when we launch!
        </p>
      </div>

      {/* Form */}
      <div className="w-full max-w-2xl mx-auto bg-white/80 border border-white p-8 rounded-2xl shadow-[0_-8px_20px_-5px_rgba(0,0,0,0.12)] backdrop-blur-md">
        {/* Role Selection */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-darkgray mb-2 tracking-wide">
            I am joining as a
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['patient', 'optometrist'].map(role => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role as WaitlistRole)}
                className={`px-3 py-2 rounded-full border text-xs font-medium transition-all duration-300 ${
                  selectedRole === role
                    ? 'border-primary-cyan bg-primary-cyan text-white shadow-md'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-primary-cyan hover:text-primary-cyan'
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-xs font-medium text-gray-700 mb-1.5 tracking-wide">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter full name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan transition-all"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5 tracking-wide">
              Email Address <span className="text-red-600">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="johndoe@email.com"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-cyan/50 focus:border-primary-cyan transition-all"
            />
          </div>

          {/* Button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing || isSubmitted}
            className={`w-full py-2.5 rounded-lg font-semibold text-xs tracking-wide transition-all duration-300 disabled:opacity-60 ${
              isSubmitted
                ? 'bg-primary-yellow text-darkgray'
                : 'bg-primary-cyan hover:bg-primary-darkcyan text-white shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_10px_rgba(0,0,0,0.18)]'
            }`}
          >
            {isSubmitted && !isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Added to Waitlist!
              </span>
            ) : isProcessing ? (
              'Processing...'
            ) : (
              'Join Waitlist'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WaitList;